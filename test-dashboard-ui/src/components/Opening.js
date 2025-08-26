import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, Grid, LinearProgress } from '@mui/material';
import { CircularProgress } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { LineChart, Line } from 'recharts';

const COLORS = ['#00E5FF', '#0088FE', '#FF4842', '#FFBB28'];

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    height: '100vh',
                    color: 'error.main',
                    flexDirection: 'column',
                    gap: 2
                }}>
                    <Typography variant="h6">Something went wrong</Typography>
                    <Typography variant="body1">{this.state.error?.message}</Typography>
                </Box>
            );
        }

        return this.props.children;
    }
}

const Opening = () => {
    const [requirements, setRequirements] = useState([]);
    const [testCases, setTestCases] = useState([]);
    const [testRuns, setTestRuns] = useState([]);
    const [transitMetrics, setTransitMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        console.log('Opening component mounted');
        const fetchData = async () => {
            try {
                console.log('Fetching data...');
                const [reqResponse, testCasesResponse, testRunsResponse, transitResponse] = await Promise.all([
                    fetch('http://localhost:5000/api/requirements'),
                    fetch('http://localhost:5000/api/testcases'),
                    fetch('http://localhost:5000/api/testruns'),
                    fetch('http://localhost:5000/api/transitmetricsdaily')
                ]);

                console.log('API responses received:', {
                    requirements: reqResponse.ok,
                    testCases: testCasesResponse.ok,
                    testRuns: testRunsResponse.ok,
                    transitMetrics: transitResponse.ok
                });

                if (!reqResponse.ok || !testCasesResponse.ok || !testRunsResponse.ok || !transitResponse.ok) {
                    throw new Error('One or more API requests failed');
                }

                const reqData = await reqResponse.json();
                const testCasesData = await testCasesResponse.json();
                const testRunsData = await testRunsResponse.json();
                const transitData = await transitResponse.json();

                console.log('Data processed:', {
                    requirementsCount: reqData.length,
                    testCasesCount: testCasesData.length,
                    testRunsCount: testRunsData.length,
                    transitMetricsCount: transitData.length
                });

                setRequirements(reqData);
                setTestCases(testCasesData);
                setTestRuns(testRunsData);
                setTransitMetrics(transitData);
                setError(null);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate Requirements Progress
    const totalRequirements = testCases.length;
    const approvedRequirements = testCases.filter(tc => tc.Status === "Approved").length;
    const requirementsProgress = Math.round((approvedRequirements / totalRequirements) * 100) || 0;

    // Calculate Test Cases Progress
    const reviewedTestCases = testCases.filter(tc => ["Approved", "In review"].includes(tc.Status)).length;
    const testCasesProgress = Math.round((reviewedTestCases / totalRequirements) * 100) || 0;

    // Process Test Runs Data
    const processedTestRuns = testRuns.reduce((acc, run) => {
        const dateValue = run.execution_date || run.Execution_Date;
        if (!dateValue) return acc;
        
        const date = dateValue.split(' ')[0];
        if (!acc[date]) {
            acc[date] = { date, total: 0, passed: 0, failed: 0 };
        }
        acc[date].total += 1;
        const result = run.result || run.Result;
        if (result === 'Pass') acc[date].passed += 1;
        if (result === 'Fail') acc[date].failed += 1;
        return acc;
    }, {});

    const testRunsData = Object.values(processedTestRuns);

    // Process Transit Metrics
    const transitMetricsData = transitMetrics.map(tm => ({
        date: tm.Date,
        fvm: parseInt(tm.FVM_Transactions),
        gate: parseFloat(tm.Success_Rate_Gate),
        bus: parseFloat(tm.Success_Rate_Bus),
        station: parseFloat(tm.Success_Rate_Gate)
    }));

    // Calculate Test Types Distribution
    const testTypesData = [
        { name: 'Functional', value: testCases.filter(tc => tc.Type === "Feature").length },
        { name: 'Non-Functional', value: testCases.filter(tc => tc.Type.includes("Non")).length },
        { name: 'Regression', value: testCases.filter(tc => tc.Type === "Regression").length },
        { name: 'Performance', value: testCases.filter(tc => tc.Type === "Performance").length }
    ];

    // Calculate Test Execution Results
    const executionResults = [
        { name: 'Pass', value: testRuns.filter(tr => (tr.result || tr.Result) === "Pass").length },
        { name: 'Fail', value: testRuns.filter(tr => (tr.result || tr.Result) === "Fail").length },
        { name: 'Blocked', value: testCases.filter(tc => tc.Status === "Draft").length }
    ];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'error.main' }}>
                <Typography variant="h6">Error: {error}</Typography>
            </Box>
        );
    }

    return (
        <ErrorBoundary>
            <Box sx={{ 
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#0A192F',
                minHeight: '100vh',
                p: { xs: 2, sm: 3 },
                color: 'white',
                m: 0,
                boxSizing: 'border-box',
                width: '100%',
                overflow: 'hidden'
            }}>
                <Typography 
                    variant="h2" 
                    sx={{ 
                        mb: 4, 
                        color: '#00E5FF', 
                        textAlign: 'center',
                        fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                    }}
                >
                    Robotics Transit Testing
                </Typography>
                
                <Grid container spacing={3}>
                    {/* Requirements Card */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ 
                            p: 3, 
                            bgcolor: '#172A45', 
                            color: 'white', 
                            borderRadius: 2,
                            minHeight: '200px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h5" sx={{ mb: 3 }}>Requirements</Typography>
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                flexGrow: 1,
                                gap: 4
                            }}>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress
                                        variant="determinate"
                                        value={requirementsProgress}
                                        size={100}
                                        thickness={4}
                                        sx={{ color: '#00E5FF' }}
                                    />
                                    <Box sx={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                        <Typography variant="h5" sx={{ color: '#00E5FF' }}>{requirementsProgress}%</Typography>
                                    </Box>
                                </Box>
                                <Box>
                                    <Typography variant="h4">{totalRequirements}</Typography>
                                    <Typography variant="subtitle1" sx={{ color: '#00E5FF' }}>{approvedRequirements} completed</Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Test Cases Card */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ 
                            p: 3, 
                            bgcolor: '#172A45', 
                            color: 'white', 
                            borderRadius: 2,
                            minHeight: '200px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h5" sx={{ mb: 3 }}>Test Cases</Typography>
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                justifyContent: 'center',
                                flexGrow: 1,
                                gap: 3
                            }}>
                                <Box>
                                    <Typography variant="body1" sx={{ mb: 1 }}>Created</Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={100} 
                                        sx={{ 
                                            height: 8, 
                                            borderRadius: 4,
                                            backgroundColor: 'rgba(0, 229, 255, 0.1)',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: '#00E5FF'
                                            }
                                        }} 
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="body1" sx={{ mb: 1 }}>Reviewed</Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={testCasesProgress} 
                                        sx={{ 
                                            height: 8, 
                                            borderRadius: 4,
                                            backgroundColor: 'rgba(0, 229, 255, 0.1)',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: '#0088FE'
                                            }
                                        }} 
                                    />
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Test Runs Chart */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ 
                            p: 3, 
                            bgcolor: '#172A45', 
                            color: 'white', 
                            borderRadius: 2,
                            minHeight: '300px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h5" sx={{ mb: 3 }}>Test Runs</Typography>
                            <Box sx={{ flexGrow: 1, minHeight: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={testRunsData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#243B55" />
                                        <XAxis dataKey="date" stroke="#fff" />
                                        <YAxis stroke="#fff" />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#172A45', 
                                                border: '1px solid #00E5FF',
                                                borderRadius: '4px' 
                                            }} 
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="passed" 
                                            name="Passed"
                                            stroke="#00E5FF" 
                                            strokeWidth={2}
                                            dot={{ fill: '#00E5FF' }}
                                        />
                                        <Line 
                                            type="monotone" 
                                            dataKey="failed" 
                                            name="Failed"
                                            stroke="#FF4842" 
                                            strokeWidth={2}
                                            dot={{ fill: '#FF4842' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Transit Metrics */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ 
                            p: 3, 
                            bgcolor: '#172A45', 
                            color: 'white', 
                            borderRadius: 2,
                            minHeight: '300px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h5" sx={{ mb: 3 }}>Transit Metrics</Typography>
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: 2,
                                flexGrow: 1,
                                justifyContent: 'center'
                            }}>
                                {['Fare Vending Machine', 'Gate Validator', 'Station Validator', 'Bus Validator'].map((item, index) => (
                                    <Box key={item} sx={{ 
                                        display: 'flex', 
                                        alignItems: 'center',
                                        p: 2,
                                        bgcolor: 'rgba(0, 229, 255, 0.05)',
                                        borderRadius: 1,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            bgcolor: 'rgba(0, 229, 255, 0.1)',
                                            transform: 'translateX(8px)'
                                        }
                                    }}>
                                        <Box sx={{ 
                                            width: 10, 
                                            height: 10, 
                                            borderRadius: '50%', 
                                            bgcolor: COLORS[index],
                                            mr: 2 
                                        }} />
                                        <Typography>{item}</Typography>
                                        <Typography sx={{ ml: 'auto', color: '#00E5FF' }}>
                                            {transitMetrics[0] ? 
                                                index === 0 ? `${transitMetrics[0].FVM_Transactions} txns` :
                                                index === 1 ? `${transitMetrics[0].Success_Rate_Gate}%` :
                                                index === 2 ? `${transitMetrics[0].Success_Rate_Gate}%` :
                                                `${transitMetrics[0].Success_Rate_Bus}%`
                                            : 'N/A'}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Test Types */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ 
                            p: 3, 
                            bgcolor: '#172A45', 
                            color: 'white', 
                            borderRadius: 2,
                            minHeight: '300px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h5" sx={{ mb: 3 }}>Test Types</Typography>
                            <Box sx={{ flexGrow: 1, minHeight: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={testTypesData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#243B55" />
                                        <XAxis type="number" stroke="#fff" />
                                        <YAxis dataKey="name" type="category" stroke="#fff" width={100} />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#172A45', 
                                                border: '1px solid #00E5FF',
                                                borderRadius: '4px' 
                                            }} 
                                        />
                                        <Bar 
                                            dataKey="value" 
                                            fill="#00E5FF"
                                            radius={[0, 4, 4, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Test Execution Results */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ 
                            p: 3, 
                            bgcolor: '#172A45', 
                            color: 'white', 
                            borderRadius: 2,
                            minHeight: '300px',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <Typography variant="h5" sx={{ mb: 3 }}>Test Execution Results</Typography>
                            <Box sx={{ flexGrow: 1, minHeight: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={executionResults}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {executionResults.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: '#172A45', 
                                                border: '1px solid #00E5FF',
                                                borderRadius: '4px' 
                                            }} 
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </ErrorBoundary>
    );
};

export default Opening; 