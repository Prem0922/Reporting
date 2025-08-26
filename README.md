# Reporting Application

A comprehensive Test Management and Reporting system for transit card operations, built with Flask backend and React frontend. The system provides detailed test results tracking, defect management, and comprehensive reporting capabilities.

## 🏗️ Architecture

- **Backend**: Flask + SQLAlchemy + PostgreSQL
- **Frontend**: React + TypeScript + Material-UI + Chart.js
- **Database**: PostgreSQL (production) / SQLite (development)
- **Authentication**: JWT-based with bcrypt password hashing
- **Reporting**: Advanced analytics with Chart.js and Kendo UI Grid
- **Notifications**: Email and SMS integration via Twilio

## 📁 Project Structure

```
Reporting/
├── dbapi.py                 # Flask app entry point and main API
├── database_postgresql.py   # Database models and connection
├── requirements.txt         # Python dependencies
├── env.example             # Environment variables template
├── start_backends.py       # Multi-backend startup script
├── test-dashboard-ui/      # React frontend application
│   ├── src/                # React source code
│   ├── public/             # Static assets
│   ├── package.json        # Node.js dependencies
│   └── README.md           # Frontend documentation
├── uploads/                # File upload directory
├── instance/               # Instance-specific files
├── test_*.py              # API testing utilities
├── create_db.py           # Database initialization
├── clear_data.py          # Data cleanup utilities
├── setup_postgresql.py    # PostgreSQL setup
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- **Python 3.11+**
- **Node.js 18+**
- **npm or yarn**
- **PostgreSQL** (recommended) / SQLite (development)
- **Git**

### 1. Backend Setup

#### Clone and Navigate
```bash
cd Reporting
```

#### Create Virtual Environment
**Windows:**
```bash
python -m venv .venv
.\.venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

#### Install Dependencies
```bash
pip install -r requirements.txt
```

#### Environment Configuration
Create a `.env` file in `Reporting/`:
```env
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/reporting_db

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# Email Configuration (for password reset)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_email_password
RESET_LINK_BASE=http://localhost:3000/reset-password

# Twilio Configuration (optional)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# JSONBin API Key (optional)
JSONBIN_API_KEY=your_jsonbin_api_key
```

#### Initialize Database
```bash
# Create database tables
python create_db.py

# (Optional) Clear existing data
python clear_data.py

# (Optional) Setup PostgreSQL (if using PostgreSQL)
python setup_postgresql.py
```

#### Run Backend Server
```bash
# Start Flask backend only
python dbapi.py

# Or use the multi-backend starter
python start_backends.py
```

**Backend will be available at:**
- API Base: `http://127.0.0.1:5000`
- Swagger Docs: `http://127.0.0.1:5000/api/docs`
- Health Check: `http://127.0.0.1:5000/health`

### 2. Frontend Setup

#### Navigate to Frontend Directory
```bash
cd Reporting/test-dashboard-ui
```

#### Install Dependencies
```bash
npm install
```

#### Run Development Server
```bash
npm start
```

**Frontend will be available at:**
- `http://localhost:3000` (React default port)

#### Build for Production
```bash
npm run build
```

## 🗄️ Database Models

### Core Entities

- **User**: System users with authentication
- **Requirement**: Test requirements and specifications
- **TestCase**: Individual test cases with structured data
- **TestRun**: Test execution results and metrics
- **Defect**: Bug tracking and defect management
- **TestTypeSummary**: Aggregated test metrics by type
- **TransitMetric**: Transit-specific performance metrics

### Database Schema
```sql
-- Example table structure
users:
  - username (PK): "admin"
  - password: "hashed_password"
  - email: "admin@transit.com"
  - first_name: "Admin"
  - last_name: "User"
  - created_at: "2024-01-15T10:30:00Z"

test_cases_structured:
  - test_case_id (PK): "TC-UI-NAV-001"
  - title: "Navigation Menu Test"
  - type: "UI"
  - component: "Navigation"
  - requirement_id: "REQ-001"
  - status: "Active"
  - created_by: "tester"
  - test_steps: "Step 1: Click menu..."
  - expected_result: "Menu should open..."

test_runs:
  - run_id (PK): "RUN-001"
  - test_run_id: "TR-2024-001"
  - customer_id: 12345
  - source_system: "CRM"
  - test_case_id: "TC-UI-NAV-001"
  - execution_date: "2024-01-15"
  - result: "PASS"
  - observed_time: 1500
  - executed_by: "automation"
```

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/forgot-password` - Password reset request
- `POST /api/v1/auth/reset-password` - Password reset

### Test Management
- `POST /api/v1/results/test-runs` - Upload comprehensive test results
- `GET /api/v1/test-cases/` - Get all test cases
- `POST /api/v1/test-cases/` - Create new test case
- `PUT /api/v1/test-cases/{id}` - Update test case
- `DELETE /api/v1/test-cases/{id}` - Delete test case

### Requirements Management
- `GET /api/v1/requirements/` - Get all requirements
- `POST /api/v1/requirements/` - Create new requirement
- `PUT /api/v1/requirements/{id}` - Update requirement
- `DELETE /api/v1/requirements/{id}` - Delete requirement

### Defect Management
- `GET /api/v1/defects/` - Get all defects
- `POST /api/v1/defects/` - Create new defect
- `PUT /api/v1/defects/{id}` - Update defect
- `DELETE /api/v1/defects/{id}` - Delete defect

### Reporting & Analytics
- `GET /api/v1/reports/summary` - Get system summary
- `GET /api/v1/reports/test-metrics` - Get test metrics
- `GET /api/v1/reports/defect-analysis` - Get defect analysis
- `GET /api/v1/reports/transit-metrics` - Get transit metrics

### File Operations
- `POST /api/v1/upload/test-results` - Upload test results file
- `GET /api/v1/download/report/{format}` - Download reports
- `POST /api/v1/upload/screenshot` - Upload test screenshots

### System Operations
- `GET /health` - Health check endpoint
- `GET /api/v1/system/info` - System information
- `POST /api/v1/system/backup` - Create database backup

## 📊 Reporting Features

### Test Results Dashboard
- **Real-time Metrics**: Live test execution statistics
- **Test Run Analysis**: Detailed test run breakdowns
- **Performance Tracking**: Response time and throughput metrics
- **Defect Trends**: Bug tracking and resolution trends

### Advanced Analytics
- **Chart.js Integration**: Interactive charts and graphs
- **Kendo UI Grid**: Advanced data grid with filtering and sorting
- **Export Capabilities**: PDF, Excel, and CSV report generation
- **Custom Dashboards**: User-configurable dashboard layouts

### Transit-Specific Metrics
- **Card Operations**: Transit card usage statistics
- **System Performance**: API response times and availability
- **User Behavior**: Customer interaction patterns
- **Revenue Analytics**: Financial performance tracking

## 🧪 Testing

### Backend Testing
```bash
cd Reporting

# Test health endpoint
curl http://127.0.0.1:5000/health

# Test API endpoints
python test_api_endpoints.py

# Run comprehensive tests
python test_comprehensive_api.py
```

### Frontend Testing
```bash
cd Reporting/test-dashboard-ui

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### API Testing Scripts
```bash
cd Reporting

# Test specific endpoints
python test_commands.txt

# Test with sample data
python test_comprehensive_api.py
```

### Integration Testing
```bash
# Test file upload functionality
curl -X POST -F "file=@test_results.json" \
     http://127.0.0.1:5000/api/v1/upload/test-results

# Test report generation
curl http://127.0.0.1:5000/api/v1/reports/summary
```

## 🔧 Configuration

### Backend Configuration
- **Database**: Configure via `DATABASE_URL` environment variable
- **JWT Security**: Set `JWT_SECRET` for token signing
- **Email**: Configure SMTP settings for notifications
- **SMS**: Optional Twilio integration for SMS alerts
- **CORS**: Configured for development (allows all origins)

### Frontend Configuration
- **API Base URL**: Configured to call Flask backend
- **Authentication**: JWT tokens stored in localStorage
- **Charts**: Chart.js configuration for data visualization
- **Grid**: Kendo UI Grid configuration for data display

### Database Configuration
- **PostgreSQL**: Recommended for production
- **SQLite**: Available for development
- **Connection Pooling**: Configured for optimal performance
- **Migrations**: Alembic support for schema changes

## 🚨 Troubleshooting

### Common Issues

#### Backend Won't Start
```bash
# Check if port 5000 is available
netstat -an | grep 5000

# Check Python version
python --version

# Verify virtual environment
which python
```

#### Database Connection Issues
```bash
# Test database connection
python -c "from database_postgresql import engine; print(engine.url)"

# Recreate database
python create_db.py
```

#### Frontend Build Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### File Upload Issues
```bash
# Check uploads directory permissions
ls -la uploads/

# Verify file size limits
# Check Flask configuration for max file size
```

### Debug Mode
```bash
# Backend with debug logging
export FLASK_DEBUG=1
python dbapi.py

# Frontend with verbose logging
npm start -- --verbose
```

## 📊 Monitoring

### Health Checks
- Backend: `GET /health`
- Database: Connection status monitoring
- File System: Upload directory monitoring

### Logs
- Backend: Flask logging with configurable levels
- Database: SQLAlchemy query logging
- Frontend: Browser console logs
- File Operations: Upload/download tracking

### Performance Monitoring
- **Response Times**: API endpoint performance tracking
- **Database Queries**: Query optimization monitoring
- **File Operations**: Upload/download speed tracking
- **Memory Usage**: System resource monitoring

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Set all secrets via environment
2. **Database**: Use PostgreSQL with proper credentials
3. **File Storage**: Configure secure file upload directory
4. **CORS**: Restrict to production domains
5. **Logging**: Enable structured logging
6. **Security**: Rotate JWT secrets regularly
7. **Backup**: Regular database and file backups

### Docker Deployment
```dockerfile
# Example Dockerfile for backend
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "dbapi.py"]
```

### Environment-Specific Configurations
```bash
# Development
export FLASK_ENV=development
export DATABASE_URL=sqlite:///reporting.db

# Production
export FLASK_ENV=production
export DATABASE_URL=postgresql://user:pass@host:5432/db
export JWT_SECRET=your_secure_secret
```

## 🔗 Integration

### CRM Integration
- **Test Data**: Import test results from CRM system
- **User Management**: Synchronize user accounts
- **Metrics**: Share performance metrics

### POS Integration
- **Transaction Data**: Import POS transaction logs
- **Performance Metrics**: Track POS system performance
- **Error Reporting**: Monitor POS system errors

### External Tools
- **Jira**: Defect tracking integration
- **Jenkins**: CI/CD pipeline integration
- **Slack**: Notification integration
- **Email**: Automated report distribution

## 📈 Advanced Features

### Automated Testing
- **Test Execution**: Automated test run scheduling
- **Result Processing**: Automatic test result analysis
- **Defect Creation**: Automatic defect creation from failed tests
- **Report Generation**: Scheduled report generation

### Data Analytics
- **Trend Analysis**: Historical data trend analysis
- **Predictive Analytics**: Failure prediction models
- **Performance Optimization**: System performance recommendations
- **Capacity Planning**: Resource utilization forecasting

### Custom Reports
- **Report Builder**: Drag-and-drop report creation
- **Template Library**: Pre-built report templates
- **Scheduled Reports**: Automated report delivery
- **Export Formats**: Multiple export format support

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Standards
- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ESLint configuration
- **Database**: Use SQLAlchemy ORM
- **API**: Follow RESTful conventions

### Testing Guidelines
- **Unit Tests**: Test individual functions
- **Integration Tests**: Test API endpoints
- **Frontend Tests**: Test React components
- **End-to-End Tests**: Test complete workflows

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- **Email**: support@transit.com
- **Documentation**: Check the `/api/docs` endpoint
- **Issues**: Create an issue in the repository
- **Wiki**: Check the project wiki for detailed guides 
