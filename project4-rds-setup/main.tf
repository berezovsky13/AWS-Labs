# Configure AWS Provider
provider "aws" {
  region = "us-east-1"  # Change this to your preferred region
}

# VPC Configuration
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "rds-vpc"
  }
}

# Public Subnet
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name = "public-subnet"
  }
}

# Private Subnet for RDS
resource "aws_subnet" "private" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"

  tags = {
    Name = "private-subnet"
  }
}

# Internet Gateway
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "main-igw"
  }
}

# Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "public-rt"
  }
}

# Route Table Association
resource "aws_route_table_association" "public" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public.id
}

# Security Group for EC2
resource "aws_security_group" "ec2" {
  name        = "ec2-sg"
  description = "Security group for EC2 instance"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "ec2-sg"
  }
}

# Security Group for RDS
resource "aws_security_group" "rds" {
  name        = "rds-sg"
  description = "Security group for RDS instance"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3306
    to_port         = 3306
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
  }

  tags = {
    Name = "rds-sg"
  }
}

# RDS Subnet Group
resource "aws_db_subnet_group" "main" {
  name       = "main"
  subnet_ids = [aws_subnet.private.id]

  tags = {
    Name = "rds-subnet-group"
  }
}

# RDS Instance
resource "aws_db_instance" "main" {
  identifier           = "rds-instance"
  engine              = "mysql"
  engine_version      = "8.0"
  instance_class      = "db.t3.micro"
  allocated_storage   = 20
  storage_type        = "gp2"
  username            = "admin"
  password            = "your-secure-password"  # Change this!
  db_name             = "testdb"
  skip_final_snapshot = true

  vpc_security_group_ids = [aws_security_group.rds.id]
  db_subnet_group_name   = aws_db_subnet_group.main.name

  tags = {
    Name = "rds-instance"
  }
}

# EC2 Instance
resource "aws_instance" "app" {
  ami           = "ami-0c7217cdde317cfec"  # Ubuntu 22.04 LTS
  instance_type = "t2.micro"
  subnet_id     = aws_subnet.public.id

  vpc_security_group_ids = [aws_security_group.ec2.id]
  key_name               = "your-key-pair"  # Change this!

  user_data = <<-EOF
              #!/bin/bash
              apt-get update
              apt-get install -y nodejs npm mysql-client
              
              # Create app directory
              mkdir -p /home/ubuntu/app
              cd /home/ubuntu/app
              
              # Create app.js
              cat > app.js << 'EOL'
              const express = require('express');
              const mysql = require('mysql2');
              const app = express();
              const port = 3000;
              
              const dbConfig = {
                host: '${aws_db_instance.main.endpoint}',
                user: 'admin',
                password: 'your-secure-password',
                database: 'testdb'
              };
              
              const connection = mysql.createConnection(dbConfig);
              
              connection.connect((err) => {
                if (err) {
                  console.error('Error connecting to database:', err);
                  return;
                }
                console.log('Connected to database successfully');
              });
              
              app.use(express.json());
              
              app.get('/health', (req, res) => {
                res.json({ status: 'healthy' });
              });
              
              app.get('/users', (req, res) => {
                connection.query('SELECT * FROM users', (err, results) => {
                  if (err) {
                    console.error('Error querying database:', err);
                    res.status(500).json({ error: 'Database error' });
                    return;
                  }
                  res.json(results);
                });
              });
              
              app.post('/users', (req, res) => {
                const { name, email } = req.body;
                if (!name || !email) {
                  res.status(400).json({ error: 'Name and email are required' });
                  return;
                }
              
                connection.query(
                  'INSERT INTO users (name, email) VALUES (?, ?)',
                  [name, email],
                  (err, results) => {
                    if (err) {
                      console.error('Error inserting into database:', err);
                      res.status(500).json({ error: 'Database error' });
                      return;
                    }
                    res.status(201).json({ id: results.insertId, name, email });
                  }
                );
              });
              
              app.listen(port, '0.0.0.0', () => {
                console.log(`Server running at http://localhost:${port}`);
              });
              EOL
              
              # Create package.json
              cat > package.json << 'EOL'
              {
                "name": "rds-node-app",
                "version": "1.0.0",
                "description": "Node.js application connecting to RDS MySQL",
                "main": "app.js",
                "scripts": {
                  "start": "node app.js"
                },
                "dependencies": {
                  "express": "^4.18.2",
                  "mysql2": "^3.6.0"
                }
              }
              EOL
              
              # Install dependencies
              npm install
              
              # Create systemd service
              cat > /etc/systemd/system/node-app.service << 'EOL'
              [Unit]
              Description=Node.js RDS Application
              After=network.target
              
              [Service]
              Type=simple
              User=ubuntu
              WorkingDirectory=/home/ubuntu/app
              ExecStart=/usr/bin/node app.js
              Restart=on-failure
              
              [Install]
              WantedBy=multi-user.target
              EOL
              
              # Start the service
              systemctl daemon-reload
              systemctl enable node-app
              systemctl start node-app
              EOF

  tags = {
    Name = "app-instance"
  }
}

# Output the RDS endpoint and EC2 public IP
output "rds_endpoint" {
  value = aws_db_instance.main.endpoint
}

output "ec2_public_ip" {
  value = aws_instance.app.public_ip
} 