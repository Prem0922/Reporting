import React, { useState, useEffect } from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    Typography,
    Paper,
    Box,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    LinearProgress,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Tooltip,
    Grid,
    CircularProgress,
    Button,
} from '@mui/material';
import {
    Dashboard,
    LiveTv,
    Settings,
    Assignment,
    ListAlt,
    PlayCircleFilled,
    BugReport,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip as ChartTooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
} from 'chart.js';
import { format } from 'date-fns';
import RequirementsList from './RequirementsList';
import DefectsList from './DefectsList';
import TestTypeSummary from './TestTypeSummary';
import TransitMetricsDaily from './TransitMetricsDaily';
import TestCases from './TestCases';
import TestRunsList from './TestRuns';
import AuthContext from './AuthContext';

ChartJS.register(
    ArcElement,
    ChartTooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement
);

const DEFAULT_ITEMS_PER_PAGE = 10;

const StylizedValue = ({ value, unit, color, fontSize }) => (
    <Typography sx={{ fontWeight: 'bold', color: color, ...(fontSize && { fontSize }) }}>
        {value}
        {unit && <span style={{ fontWeight: 'normal', marginLeft: 2 }}>{unit}</span>}
    </Typography>
);

function NewDashboard() {
    const [requirements, setRequirements] = useState([]);
    const [testCases, setTestCases] = useState([]);
    const [testRuns, setTestRuns] = useState([]);
    const [transitMetrics, setTransitMetrics] = useState([]);
    const [testTypeSummary, setTestTypeSummary] = useState([]);
    const [defects, setDefects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [
                    reqResponse,
                    testCasesResponse,
                    testRunsResponse,
                    transitResponse,
                    typeResponse,
                    defectsResponse
                ] = await Promise.all([
                    fetch('http://localhost:5000/api/requirements'),
                    fetch('http://localhost:5000/api/testcases'),
                    fetch('http://localhost:5000/api/testruns'),
                    fetch('http://localhost:5000/api/transitmetricsdaily'),
                    fetch('http://localhost:5000/api/testtypesummary'),
                    fetch('http://localhost:5000/api/defects')
                ]);

                const [
                    reqData,
                    testCasesData,
                    testRunsData,
                    transitData,
                    typeData,
                    defectsData
                ] = await Promise.all([
                    reqResponse.json(),
                    testCasesResponse.json(),
                    testRunsResponse.json(),
                    transitResponse.json(),
                    typeResponse.json(),
                    defectsResponse.json()
                ]);

                setRequirements(reqData);
                setTestCases(testCasesData);
                setTestRuns(testRunsData);
                setTransitMetrics(transitData);
                setTestTypeSummary(typeData);
                setDefects(defectsData);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
        const interval = setInterval(fetchDashboardData, 300000); // Refresh every 5 minutes
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    // Calculate metrics
    const totalRequirements = requirements.length;
    
    // Calculate requirements status distribution
    const requirementStatusCounts = requirements.reduce((acc, req) => {
        const status = req.status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const requirementStatusColors = {
        'Accepted': '#66bb6a',      // Green
        'Rejected': '#ef5350',      // Red
        'In Review': '#ffa726',     // Orange
        'Design Completed': '#26c6da',    // Blue
        'Implementation Completed': '#9575cd',  // Purple
        'Testing Completed': '#4db6ac',    // Teal
        'Done': '#81c784'          // Light Green
    };

    // Calculate test cases progress
    const testCaseProgress = testCases.length > 0 ? 
        (testCases.filter(tc => tc.status === 'reviewed').length / testCases.length) * 100 : 0;

    // Calculate defects status distribution
    const defectStatusCounts = defects.reduce((acc, defect) => {
        const status = defect.Status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const totalDefects = defects.length;
    const statusColors = {
        'Open': '#ef5350',        // Red
        'In-Progress': '#ffa726', // Orange
        'Resolved': '#26c6da',    // Blue
        'Closed': '#66bb6a'       // Green
    };

    // Calculate test runs result distribution
    const testRunResults = testRuns.reduce((acc, run) => {
        const result = run.result || run.Result || 'Unknown';
        acc[result] = (acc[result] || 0) + 1;
        return acc;
    }, {});

    const testRunResultsData = {
        labels: Object.keys(testRunResults),
        datasets: [{
            data: Object.values(testRunResults),
            backgroundColor: ['#66bb6a', '#ef5350', '#ffa726', '#26c6da'],
            borderRadius: 8,
            maxBarThickness: 40,
            minBarLength: 10
        }]
    };

    // Calculate test case status percentages
    const testCaseStatusCounts = testCases.reduce((acc, tc) => {
        const status = tc.Status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const testCaseStatusData = {
        labels: Object.keys(testCaseStatusCounts),
        datasets: [{
            data: Object.values(testCaseStatusCounts),
            backgroundColor: ['#26c6da', '#ef5350', '#ffa726', '#66bb6a'],
            borderWidth: 0
        }]
    };

    // Calculate test type summary status
    const testTypeStats = testTypeSummary.reduce((acc, item) => {
        const status = item.Status || 'Unknown';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    const totalTests = Object.values(testTypeStats).reduce((a, b) => a + b, 0);
    const passPercentage = totalTests > 0 ? (testTypeStats['Pass'] || 0) / totalTests * 100 : 0;

    return (
        <Box sx={{ p: 0, backgroundColor: '#0a192f', minHeight: '100vh', color: 'white' }}>
            <Typography variant="h3" sx={{ mb: 4, color: 'white' }}>
                Robotics Transit Testing
            </Typography>
            
            <Grid container spacing={3}>
                {/* Requirements Card */}
                <Grid item xs={12} sx={{ flexBasis: { md: '20%' }, maxWidth: { md: '20%' } }}>
                    <Paper sx={{ p: 3, backgroundColor: '#0d2339', color: 'white', borderRadius: 2 }}>
                        <Typography
                            variant="h5"
                            sx={{ mb: 1, cursor: 'pointer' }}
                            onClick={() => navigate('/requirements')}
                        >
                            Requirements
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 2, color: '#26c6da' }}>
                            Total: {totalRequirements}
                        </Typography>
                        
                        <Box sx={{ mt: 3 }}>
                            {Object.entries(requirementStatusCounts).map(([status, count]) => {
                                const percentage = totalRequirements > 0 ? (count / totalRequirements) * 100 : 0;
                                return (
                                    <Box key={status} sx={{ mb: 2 }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            mb: 1 
                                        }}>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center',
                                                gap: 1
                                            }}>
                                                <Box sx={{ 
                                                    width: 8, 
                                                    height: 8, 
                                                    borderRadius: '50%', 
                                                    backgroundColor: requirementStatusColors[status] || '#26c6da' 
                                                }} />
                                                <Typography variant="body2">{status}</Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ 
                                                color: requirementStatusColors[status] || '#26c6da',
                                                fontWeight: 'bold'
                                            }}>
                                                {count}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ 
                                            width: '100%', 
                                            height: 6, 
                                            bgcolor: '#1e3a5f', 
                                            borderRadius: 3,
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}>
                                            <Box sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                height: '100%',
                                                width: `${percentage}%`,
                                                bgcolor: requirementStatusColors[status] || '#26c6da',
                                                transition: 'width 1s ease-in-out',
                                                borderRadius: 3
                                            }} />
                                        </Box>
                                        <Typography variant="caption" sx={{ 
                                            color: '#a0aec0',
                                            display: 'block',
                                            textAlign: 'right',
                                            mt: 0.5
                                        }}>
                                            {percentage.toFixed(1)}%
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Paper>
                </Grid>

                {/* Test Cases Card */}
                <Grid item xs={12} sx={{ flexBasis: { md: '20%' }, maxWidth: { md: '20%' } }}>
                    <Paper sx={{ p: 3, backgroundColor: '#0d2339', color: 'white', borderRadius: 2 }}>
                        <Typography
                            variant="h5"
                            sx={{ mb: 1, cursor: 'pointer' }}
                            onClick={() => navigate('/structured-test-cases')}
                        >
                            Test Cases
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 2, color: '#26c6da' }}>
                            Total: {testCases.length}
                        </Typography>
                        <Box sx={{ 
                            width: '100%',
                            maxWidth: '160px',
                            height: '160px',
                            margin: '0 auto',
                            position: 'relative'
                        }}>
                            <Pie
                                data={testCaseStatusData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: true,
                                    plugins: {
                                        legend: {
                                            position: 'bottom',
                                            labels: {
                                                color: 'white',
                                                padding: 8,
                                                boxWidth: 12,
                                                font: {
                                                    size: 13,
                                                    weight: 'bold'
                                                }
                                            }
                                        }
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                            {Object.entries(testCaseStatusCounts).map(([status, count], index) => (
                                <Box key={status} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ 
                                        width: 12, 
                                        height: 12, 
                                        borderRadius: '50%', 
                                        backgroundColor: ['#26c6da', '#ef5350', '#ffa726', '#66bb6a'][index % 4],
                                        mr: 1 
                                    }} />
                                    <Typography>{status}: {count}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Test Runs Card */}
                <Grid item xs={12} sx={{ flexBasis: { md: '20%' }, maxWidth: { md: '20%' } }}>
                    <Paper sx={{ p: 3, backgroundColor: '#0d2339', color: 'white', borderRadius: 2 }}>
                        <Typography
                            variant="h5"
                            sx={{ mb: 1, cursor: 'pointer' }}
                            onClick={() => navigate('/test-runs')}
                        >
                            Test Runs
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 2, color: '#26c6da' }}>
                            Total: {testRuns.length}
                        </Typography>
                        <Box sx={{ 
                            height: '160px',
                            width: '100%',
                            position: 'relative'
                        }}>
                            <Bar
                                data={testRunResultsData}
                                options={{
                                    indexAxis: 'y',
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    scales: {
                                        x: {
                                            beginAtZero: true,
                                            grid: {
                                                color: '#1e3a5f'
                                            },
                                            ticks: {
                                                color: 'white',
                                                font: { size: 9 }
                                            }
                                        },
                                        y: {
                                            grid: {
                                                display: false
                                            },
                                            ticks: {
                                                color: 'white',
                                                font: { size: 9 }
                                            }
                                        }
                                    },
                                    plugins: {
                                        legend: {
                                            display: false
                                        }
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2 }}>
                            {Object.entries(testRunResults).map(([result, count], index) => (
                                <Box key={result} sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Box sx={{ 
                                        width: 12, 
                                        height: 12, 
                                        borderRadius: '50%', 
                                        backgroundColor: ['#66bb6a', '#ef5350', '#ffa726', '#26c6da'][index % 4],
                                        mr: 1 
                                    }} />
                                    <Typography>{result}: {count}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                {/* Defects Card */}
                <Grid item xs={12} sx={{ flexBasis: { md: '20%' }, maxWidth: { md: '20%' } }}>
                    <Paper sx={{ p: 3, backgroundColor: '#0d2339', color: 'white', borderRadius: 2 }}>
                        <Typography
                            variant="h5"
                            sx={{ mb: 1, cursor: 'pointer' }}
                            onClick={() => navigate('/defects')}
                        >
                            Defects
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 3, color: '#26c6da' }}>
                            Total: {totalDefects}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                            {Object.entries(defectStatusCounts).map(([status, count]) => {
                                const percentage = totalDefects > 0 ? (count / totalDefects) * 100 : 0;
                                return (
                                    <Box key={status} sx={{ mb: 3 }}>
                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            mb: 1,
                                            '& > *': { // Ensure all children stay in bounds
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }
                                        }}>
                                            <Typography sx={{ flex: '0 1 auto' }}>{status}</Typography>
                                            <Box sx={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 1,
                                                flex: '0 1 auto'
                                            }}>
                                                <Typography sx={{ 
                                                    color: statusColors[status] || '#26c6da',
                                                    minWidth: 'auto'
                                                }}>
                                                    {count}
                                                </Typography>
                                                <Typography sx={{ 
                                                    minWidth: 'auto',
                                                    fontSize: '0.9rem'
                                                }}>
                                                    ({percentage.toFixed(1)}%)
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box sx={{ width: '100%', height: 24, bgcolor: '#1e3a5f', borderRadius: 2, overflow: 'hidden' }}>
                                            <Box
                                                sx={{
                                                    width: `${percentage}%`,
                                                    height: '100%',
                                                    bgcolor: statusColors[status] || '#26c6da',
                                                    transition: 'width 1s ease-in-out'
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>
                    </Paper>
                </Grid>

                {/* Test Type Summary Card */}
                <Grid item xs={12} sx={{ flexBasis: { md: '20%' }, maxWidth: { md: '20%' } }}>
                    <Paper sx={{ p: 3, backgroundColor: '#0d2339', color: 'white', borderRadius: 2 }}>
                        <Typography
                            variant="h5"
                            sx={{ mb: 1, cursor: 'pointer' }}
                            onClick={() => navigate('/test-type-summary')}
                        >
                            Test Type Summary
                        </Typography>
                        <Typography variant="h6" sx={{ mb: 2, color: '#26c6da' }}>
                            Total: {totalTests}
                        </Typography>
                        <Box sx={{ 
                            position: 'relative', 
                            width: '100%',
                            height: '140px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            mt: 2
                        }}>
                            {/* Semicircle Background */}
                            <Box sx={{
                                position: 'absolute',
                                width: '160px',
                                height: '80px',
                                borderRadius: '160px 160px 0 0',
                                backgroundColor: '#1e3a5f',
                                transform: 'rotate(0deg)',
                                transformOrigin: 'bottom center'
                            }} />
                            
                            {/* Pass Percentage Fill */}
                            <Box sx={{
                                position: 'absolute',
                                width: '160px',
                                height: '80px',
                                borderRadius: '160px 160px 0 0',
                                backgroundColor: '#66bb6a',
                                transform: `rotate(${180 - (passPercentage * 1.8)}deg)`,
                                transformOrigin: 'bottom center',
                                transition: 'transform 1s ease-in-out'
                            }} />

                            {/* Center Text */}
                            <Box sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -20%)',
                                textAlign: 'center',
                                zIndex: 1
                            }}>
                                <Typography variant="h4" sx={{ 
                                    color: passPercentage >= 70 ? '#66bb6a' : '#ef5350',
                                    fontSize: '2rem'
                                }}>
                                    {Math.round(passPercentage)}%
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#fff' }}>
                                    Pass Rate
                                </Typography>
                            </Box>
                        </Box>

                        {/* Pass/Fail Details */}
                        <Box sx={{ 
                            mt: 3, 
                            display: 'flex', 
                            justifyContent: 'space-around',
                            alignItems: 'center'
                        }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" sx={{ color: '#66bb6a' }}>
                                    {testTypeStats['Pass'] || 0}
                                </Typography>
                                <Typography variant="body2">Pass</Typography>
                            </Box>
                            <Box sx={{ 
                                width: '1px', 
                                height: '40px', 
                                backgroundColor: '#1e3a5f' 
                            }} />
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h5" sx={{ color: '#ef5350' }}>
                                    {testTypeStats['Fail'] || 0}
                                </Typography>
                                <Typography variant="body2">Fail</Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default function DashboardApp() {
    const [testSuites, setTestSuites] = useState([]);
    const [testRuns, setTestRuns] = useState([]);
    const [defects, setDefects] = useState([]);
    const [testTypeSummary, setTestTypeSummary] = useState([]);
    const [transitMetricsDaily, setTransitMetricsDaily] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [loading, setLoading] = useState(true);
    const { logout, user } = React.useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Map pathnames to menu items
    const pathToMenuItem = {
        '/opening': 'Dashboard',
        '/': 'Dashboard',
        '/live': 'Live',
        '/robot-status': 'Robot Status',
        '/requirements': 'Requirements',
        '/structured-test-cases': 'Structured Test Cases',
        '/test-runs': 'Test Runs',
        '/defects': 'Defects',
        '/test-type-summary': 'Test Type Summary',
        '/transit-metrics-daily': 'Transit Metrics Daily',
    };
    const currentMenuItem = pathToMenuItem[location.pathname] || '';

    useEffect(() => {
        setLoading(true);
        setFetchError(null);
        let apiUrl = '';
        // Use currentMenuItem instead of activeMenuItem
        if (currentMenuItem === 'Dashboard') {
            setLoading(false); // Don't make API call for Dashboard
            return;
        } else if (currentMenuItem === 'Requirements') {
            setLoading(false); return;
        } else if (currentMenuItem === 'Structured Test Cases') {
            apiUrl = 'http://localhost:5000/api/testcases';
        } else if (currentMenuItem === 'Test Runs') {
            apiUrl = 'http://localhost:5000/api/testruns';
        } else if (currentMenuItem === 'Defects') {
            setLoading(false); return;
        } else if (currentMenuItem === 'Test Type Summary') {
            apiUrl = 'http://localhost:5000/api/testtypesummary';
        } else if (currentMenuItem === 'Transit Metrics Daily') {
            apiUrl = 'http://localhost:5000/api/transitmetricsdaily';
        } else if (currentMenuItem === 'Live' || currentMenuItem === 'Robot Status') {
            setLoading(false); return;
        }
        if (apiUrl) {
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
                    return response.json();
                })
                .then(data => {
                    if (currentMenuItem === 'Dashboard') { setTestSuites(data); }
                    else if (currentMenuItem === 'Structured Test Cases') { setTestSuites(data); }
                    else if (currentMenuItem === 'Test Runs') { setTestRuns(data); }
                    else if (currentMenuItem === 'Defects') { setDefects(data); }
                    else if (currentMenuItem === 'Test Type Summary') { setTestTypeSummary(data); }
                    else if (currentMenuItem === 'Transit Metrics Daily') { setTransitMetricsDaily(data); }
                    setLoading(false);
                })
                .catch(error => {
                    console.error(`Error fetching ${currentMenuItem.toLowerCase().replace(/ /g, '-')}:`, error);
                    setFetchError(`Failed to load ${currentMenuItem.toLowerCase().replace(/ /g, '-')}.`);
                    if (currentMenuItem === 'Dashboard' || currentMenuItem === 'Structured Test Cases') { setTestSuites([]); }
                    if (currentMenuItem === 'Test Runs') { setTestRuns([]); }
                    if (currentMenuItem === 'Defects') { setDefects([]); }
                    if (currentMenuItem === 'Test Type Summary') { setTestTypeSummary([]); }
                    if (currentMenuItem === 'Transit Metrics Daily') { setTransitMetricsDaily([]); }
                    setLoading(false);
                });
        } else {
            setTestSuites([]); setTestRuns([]); setDefects([]); setTestTypeSummary([]); setTransitMetricsDaily([]);
            setFetchError(null); setLoading(false);
        }
    }, [currentMenuItem]);

    const getPathForItem = (itemName) => {
        switch (itemName) {
            case 'Dashboard': return '/opening';
            case 'Structured Test Cases': return '/structured-test-cases';
            case 'Test Runs': return '/test-runs';
            case 'Defects': return '/defects';
            case 'Test Type Summary': return '/test-type-summary';
            case 'Transit Metrics Daily': return '/transit-metrics-daily';
            case 'Live': return '/live';
            case 'Robot Status': return '/robot-status';
            case 'Requirements': return '/requirements';
            default: return '/' + itemName.toLowerCase().replace(/ /g, '-');
        }
    };
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            <Drawer
                sx={{
                    width: 260,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 260,
                        boxSizing: 'border-box',
                        backgroundColor: '#303f9f',
                        color: '#fff',
                        borderRight: 'none',
                        paddingTop: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={drawerOpen}
            >
                <Typography variant="h5" sx={{ padding: 2, mb: 2, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Menu</Typography>
                <List sx={{ flexGrow: 1, paddingX: 2 }}>
                    {['Dashboard', 'Live', 'Robot Status', 'Requirements', 'Structured Test Cases', 'Test Runs', 'Defects', 'Test Type Summary', 'Transit Metrics Daily'].map((item) => (
                        <ListItem
                            key={item}
                            component={Link}
                            to={getPathForItem(item)}
                            sx={{
                                backgroundColor: currentMenuItem === item ? '#e3f2fd !important' : 'transparent !important',
                                color: currentMenuItem === item ? '#1976d2 !important' : '#fff !important',
                                marginBottom: 1,
                                borderRadius: 4,
                                padding: '10px 15px',
                                '&:hover': { backgroundColor: '#e3f2fd', color: '#1976d2', },
                            }}
                        >
                            <IconButton sx={{ color: currentMenuItem === item ? '#1976d2 !important' : '#fff !important', marginRight: 1 }}>
                                {item === 'Dashboard' && <Dashboard />}
                                {item === 'Live' && <LiveTv />}
                                {item === 'Robot Status' && <Settings />}
                                {item === 'Requirements' && <Assignment />}
                                {item === 'Structured Test Cases' && <ListAlt />}
                                {item === 'Test Runs' && <PlayCircleFilled />}
                                {item === 'Defects' && <BugReport />}
                                {item === 'Test Type Summary' && <ListAlt />}
                                {item === 'Transit Metrics Daily' && <ListAlt />}
                            </IconButton>
                            <ListItemText primary={item} primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItem>
                    ))}
                </List>
                {/* Logout button at the bottom of the sidebar */}
                <Box sx={{ p: 2, pb: 3 }}>
                  <button
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: '#d32f2f',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '1rem'
                    }}
                    onClick={logout}
                  >
                    Logout
                  </button>
                </Box>
            </Drawer>
            <Box sx={{ flexGrow: 1, backgroundColor: '#0a192f' }}>
                <Routes>
                    <Route path="/opening" element={<Box sx={{ p: 4 }}><NewDashboard /></Box>} />
                    <Route path="/live" element={<Box sx={{ p: 4 }}><Paper sx={{ padding: 3, borderRadius: 2 }}><Typography variant="h6">Live Data Streaming (Imagine something dynamic here!)</Typography></Paper></Box>} />
                    <Route path="/robot-status" element={<Box sx={{ p: 4 }}><Paper sx={{ padding: 3, borderRadius: 2 }}><Typography variant="h6">Robot Status Monitoring (Maybe animated icons?)</Typography></Paper></Box>} />
                    <Route path="/requirements" element={<Box sx={{ p: 4 }}><RequirementsList /></Box>} />
                    <Route path="/structured-test-cases" element={<Box sx={{ p: 4 }}><TestCases structuredTests={testSuites} loading={loading && currentMenuItem === 'Structured Test Cases'} /></Box>} />
                    <Route path="/test-runs" element={<Box sx={{ p: 4 }}><TestRunsList testRuns={testRuns} fetchError={fetchError} loading={loading && currentMenuItem === 'Test Runs'} /></Box>} />
                    <Route path="/defects" element={<Box sx={{ p: 4 }}><DefectsList /></Box>} />
                    <Route path="/test-type-summary" element={<Box sx={{ p: 4 }}><TestTypeSummary testTypeSummary={testTypeSummary} fetchError={fetchError} loading={loading && currentMenuItem === 'Test Type Summary'} /></Box>} />
                    <Route path="/transit-metrics-daily" element={<Box sx={{ p: 4 }}><TransitMetricsDaily transitMetricsDaily={transitMetricsDaily} fetchError={fetchError} loading={loading && currentMenuItem === 'Transit Metrics Daily'} /></Box>} />
                </Routes>
            </Box>
        </Box>
    );
} 