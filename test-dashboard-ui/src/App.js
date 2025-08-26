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
    Tooltip, // Ensure Tooltip is here
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
import { Routes, Route, Link, useParams, useNavigate, Navigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend } from 'chart.js'; // Renamed Chart Tooltip to avoid conflict
import { format } from 'date-fns';
import RequirementsList from './RequirementsList';
import DefectsList from './DefectsList';
import TestTypeSummary from './TestTypeSummary';
import TransitMetricsDaily from './TransitMetricsDaily';
import TestCases from './TestCases';
import TestRunsList from './TestRuns';

const DEFAULT_ITEMS_PER_PAGE = 10;

const StylizedValue = ({ value, unit, color, fontSize }) => (
    <Typography sx={{ fontWeight: 'bold', color: color, ...(fontSize && { fontSize }) }}>
        {value}
        {unit && <span style={{ fontWeight: 'normal', marginLeft: 2 }}>{unit}</span>}
    </Typography>
);

function StructuredTestCases({ structuredTests, loading }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [structuredTests]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    if (loading) { return <LinearProgress sx={{ margin: 2 }} />; }
    const safeStructuredTests = Array.isArray(structuredTests) ? structuredTests : [];

    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = safeStructuredTests.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(safeStructuredTests.length / rowsPerPage);

    if (currentItems.length === 0 && !loading && safeStructuredTests.length === 0) { // Check currentItems after definition
        return ( <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}> <Typography variant="h4" sx={{ marginBottom: 3, color: '#2196f3' }}> <ListAlt sx={{ marginRight: 1 }} /> Structured Test Cases </Typography> <Typography variant="body1">No structured test cases available.</Typography> </Paper> );
    }

    return (
        <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 3, color: '#2196f3' }}> <ListAlt sx={{ marginRight: 1, verticalAlign: "middle" }} /> Structured Test Cases </Typography>
            {safeStructuredTests.length > 0 ? (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#e0f2f7' }}>
                                <TableRow> <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Test Case ID</TableCell> <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Title</TableCell> <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Type</TableCell> <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Status</TableCell> <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Component</TableCell> <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Requirement ID</TableCell> <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Created By</TableCell> <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Created At</TableCell> </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentItems.map(test => (
                                    <TableRow key={test.Test_Case_ID} sx={{ '&:nth-child(even)': { backgroundColor: '#f9f9f9' } }}> <TableCell><StylizedValue value={test.Test_Case_ID} color="#757575" /></TableCell> <TableCell>{test.Title}</TableCell> <TableCell>{test.Type}</TableCell> <TableCell>{test.Status}</TableCell> <TableCell>{test.Component}</TableCell> <TableCell>{test.Requirement_ID}</TableCell> <TableCell>{test.Created_by}</TableCell> <TableCell>{test.Created_at ? format(new Date(test.Created_at), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}</TableCell> </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, marginTop: 2, flexWrap: 'wrap' }}>
                        <Typography variant="body2" sx={{ mr: 2, mb: { xs: 1, sm: 0 } }}> Showing {safeStructuredTests.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, safeStructuredTests.length)} of {safeStructuredTests.length} items </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <FormControl size="small" sx={{ m: 1, minWidth: 70, mr: 2 }}>
                                <InputLabel id="stc-rows-per-page-label">Rows</InputLabel>
                                <Select labelId="stc-rows-per-page-label" id="stc-rows-per-page-select" value={rowsPerPage} label="Rows" onChange={handleChangeRowsPerPage} > <MenuItem value={5}>5</MenuItem> <MenuItem value={10}>10</MenuItem> <MenuItem value={25}>25</MenuItem> <MenuItem value={50}>50</MenuItem> </Select>
                            </FormControl>
                            {safeStructuredTests.length > rowsPerPage && ( <Pagination count={pageCount} page={currentPage} onChange={handlePageChange} color="primary" shape="rounded" size="small" /> )}
                        </Box>
                    </Box>
                </>
            ) : (
                !loading && <Typography variant="body1">No structured test cases available.</Typography>
            )}
        </Paper>
    );
}

// --- DashboardContent MODIFIED FOR PAGINATION, CORRECTED DATA ACCESS & currentItems DEFINITION ---
function DashboardContent({ testSuites, fetchError, loading }) {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

    useEffect(() => {
        setCurrentPage(1);
    }, [testSuites]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleTestSuiteClick = (testId) => {
        navigate(`/test-suite/${testId}`);
    };

    if (loading) { return <LinearProgress sx={{ margin: 2 }} />; }
    if (fetchError) { return <div style={{ color: 'red', fontWeight: 'bold', margin: '20px' }}>Error: {fetchError}</div>; }

    const safeTestSuites = Array.isArray(testSuites) ? testSuites : [];

    // Define currentItems and pageCount *before* using them in conditional rendering
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = safeTestSuites.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(safeTestSuites.length / rowsPerPage);

    // Adjusted condition for "No test suites available"
    if (safeTestSuites.length === 0 && !loading) {
        return (
            <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" sx={{ marginBottom: 3, color: '#2196f3' }}>
                    <Dashboard sx={{ marginRight: 1, verticalAlign: "middle" }} /> Test Results Dashboard
                </Typography>
                <Typography variant="body1">No test suites available.</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 3, color: '#2196f3' }}> <Dashboard sx={{ marginRight: 1, verticalAlign: "middle" }} /> Test Results Dashboard </Typography>
            {/* Render table structure if there are items to show based on currentItems potentially being empty but safeTestSuites having data (for other pages) */}
            {/* The main check is actually currentItems.length > 0 for the table body content itself below */}
            <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
                <Table sx={{ minWidth: 650 }} aria-label="test suite table">
                    <TableHead sx={{ backgroundColor: '#e0f2f7' }}>
                        <TableRow> <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', width: '25%', fontSize: '1.1em' }}>Test Suite</TableCell> <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', width: '25%', fontSize: '1.1em' }}>Last Run Time</TableCell> <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', width: '25%', textAlign: 'center', fontSize: '1.1em' }}>Total Tests</TableCell> <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', width: '25%', textAlign: 'center', fontSize: '1.1em' }}>Pass/Fail</TableCell> </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.length > 0 ? currentItems.map(suite => { // Check currentItems here before mapping
                            const passPercentage = suite.pass_percentage || 0;
                            const failPercentage = suite.fail_percentage || 0;
                            const totalTests = suite.total_tests || 0;
                            const lastRunTimestamp = suite.last_run_timestamp;
                            const chartData = { labels: ['Pass', 'Fail'], datasets: [ { data: [passPercentage, failPercentage], backgroundColor: ['#4caf50', '#d32f2f'], borderWidth: 3, borderColor: '#f5f5f5', cutout: '60%', hoverOffset: 10, }, ], };
                            const chartOptions = { plugins: { legend: { display: false, }, tooltip: { callbacks: { label: (context) => `${context.label}: ${context.formattedValue}%`, }, }, }, animation: { animateRotate: true, animateScale: false, duration: 800, easing: 'easeInOutCubic', }, elements: { arc: { borderWidth: 3, borderColor: '#f5f5f5', }, }, maintainAspectRatio: false, };
                            return (
                                <TableRow key={suite.test_id} hover sx={{ '&:nth-child(even)': { backgroundColor: '#f9f9f9' }, cursor: 'pointer' }} onClick={() => handleTestSuiteClick(suite.test_id)} >
                                    <TableCell> <StylizedValue value={suite.test_id} color="#3f51b5" fontSize="1.2em" /> </TableCell>
                                    <TableCell>{lastRunTimestamp ? format(new Date(lastRunTimestamp), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}</TableCell>
                                    <TableCell align="center"><StylizedValue value={totalTests} color="#673ab7" /></TableCell>
                                    <TableCell align="center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ width: '80px', height: '80px' }}> <Pie data={chartData} options={chartOptions} /> </div>
                                        <Typography variant="caption" align="center"> <span style={{ color: '#4caf50', fontWeight: 'bold' }}>{Math.round(passPercentage)}%</span> Pass /{' '} <span style={{ color: '#d32f2f', fontWeight: 'bold' }}>{Math.round(failPercentage)}%</span> Fail </Typography>
                                    </TableCell>
                                </TableRow>
                            );
                        }) : (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    {/* This will show if safeTestSuites has data, but current page has no items (e.g. navigating to an empty page) */}
                                    {/* Or if currentItems is genuinely empty from the start and not loading */}
                                    {!loading && <Typography>No data for current page.</Typography>}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, marginTop: 2, flexWrap: 'wrap' }}>
                <Typography variant="body2" sx={{ mr: 2, mb: { xs: 1, sm: 0 } }}> Showing {safeTestSuites.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, safeTestSuites.length)} of {safeTestSuites.length} items </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                    <FormControl size="small" sx={{ m: 1, minWidth: 70, mr: 2 }}>
                        <InputLabel id="dc-rows-per-page-label">Rows</InputLabel>
                        <Select labelId="dc-rows-per-page-label" id="dc-rows-per-page-select" value={rowsPerPage} label="Rows" onChange={handleChangeRowsPerPage} > <MenuItem value={5}>5</MenuItem> <MenuItem value={10}>10</MenuItem> <MenuItem value={25}>25</MenuItem> <MenuItem value={50}>50</MenuItem> </Select>
                    </FormControl>
                    {safeTestSuites.length > rowsPerPage && ( <Pagination count={pageCount} page={currentPage} onChange={handlePageChange} color="primary" shape="rounded" size="small" /> )}
                </Box>
            </Box>
        </Paper>
    );
}

function App() {
    const [testSuites, setTestSuites] = useState([]);
    const [testRuns, setTestRuns] = useState([]);
    const [defects, setDefects] = useState([]);
    const [testTypeSummary, setTestTypeSummary] = useState([]);
    const [transitMetricsDaily, setTransitMetricsDaily] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [activeMenuItem, setActiveMenuItem] = useState('Dashboard');
    const [drawerOpen, setDrawerOpen] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setFetchError(null);
        let apiUrl = '';

        if (activeMenuItem === 'Dashboard') {
            apiUrl = 'http://localhost:5000/api/tests';
        } else if (activeMenuItem === 'Requirements') {
            setLoading(false); return;
        } else if (activeMenuItem === 'Structured Test Cases') {
            apiUrl = 'http://localhost:5000/api/testcases';
        } else if (activeMenuItem === 'Test Runs') {
            apiUrl = 'http://localhost:5000/api/testruns';
        } else if (activeMenuItem === 'Defects') {
            setLoading(false); return;
        } else if (activeMenuItem === 'Test Type Summary') {
            apiUrl = 'http://localhost:5000/api/testtypesummary';
        } else if (activeMenuItem === 'Transit Metrics Daily') {
            apiUrl = 'http://localhost:5000/api/transitmetricsdaily';
        } else if (activeMenuItem === 'Live' || activeMenuItem === 'Robot Status') {
            setLoading(false); return;
        }

        if (apiUrl) {
            fetch(apiUrl)
                .then(response => {
                    if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`); }
                    return response.json();
                })
                .then(data => {
                    if (activeMenuItem === 'Dashboard') { setTestSuites(data); }
                    else if (activeMenuItem === 'Structured Test Cases') { setTestSuites(data); }
                    else if (activeMenuItem === 'Test Runs') { setTestRuns(data); }
                    else if (activeMenuItem === 'Defects') { setDefects(data); }
                    else if (activeMenuItem === 'Test Type Summary') { setTestTypeSummary(data); }
                    else if (activeMenuItem === 'Transit Metrics Daily') { setTransitMetricsDaily(data); }
                    setLoading(false);
                })
                .catch(error => {
                    console.error(`Error fetching ${activeMenuItem.toLowerCase().replace(/ /g, '-')}:`, error);
                    setFetchError(`Failed to load ${activeMenuItem.toLowerCase().replace(/ /g, '-')}.`);
                    if (activeMenuItem === 'Dashboard' || activeMenuItem === 'Structured Test Cases') { setTestSuites([]); }
                    if (activeMenuItem === 'Test Runs') { setTestRuns([]); }
                    if (activeMenuItem === 'Defects') { setDefects([]); }
                    if (activeMenuItem === 'Test Type Summary') { setTestTypeSummary([]); }
                    if (activeMenuItem === 'Transit Metrics Daily') { setTransitMetricsDaily([]); }
                    setLoading(false);
                });
        } else {
            setTestSuites([]); setTestRuns([]); setDefects([]); setTestTypeSummary([]); setTransitMetricsDaily([]);
            setFetchError(null); setLoading(false);
        }
    }, [activeMenuItem]);

    const handleMenuItemClick = (item) => {
        setActiveMenuItem(item);
    };
    const getPathForItem = (itemName) => {
        switch (itemName) {
            case 'Dashboard': return '/';
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
                        borderRight: '1px solid #ccc',
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
                <Typography variant="h5" sx={{ padding: 2, fontWeight: 'bold', color: '#fff', textAlign: 'center' }}>Menu</Typography>
                <List sx={{ flexGrow: 1, paddingX: 1 }}>
                    {['Dashboard', 'Live', 'Robot Status', 'Requirements', 'Structured Test Cases', 'Test Runs', 'Defects', 'Test Type Summary', 'Transit Metrics Daily'].map((item) => (
                        <ListItem
                            key={item}
                            onClick={() => handleMenuItemClick(item)}
                            component={Link}
                            to={getPathForItem(item)}
                            sx={{
                                backgroundColor: activeMenuItem === item ? '#e3f2fd !important' : 'transparent !important',
                                color: activeMenuItem === item ? '#1976d2 !important' : '#fff !important',
                                marginBottom: 1,
                                borderRadius: 4,
                                padding: '10px 15px',
                                '&:hover': { backgroundColor: '#e3f2fd', color: '#1976d2', },
                            }}
                        >
                            <IconButton sx={{ color: activeMenuItem === item ? '#1976d2 !important' : '#fff !important', marginRight: 1 }}>
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
            </Drawer>
            <Box sx={{ flexGrow: 1, padding: 0 }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/opening" replace />} />
                    <Route path="/opening" element={<DashboardContent />} />
                    <Route path="/live" element={<Paper sx={{ padding: 3, borderRadius: 2 }}><Typography variant="h6">Live Data Streaming</Typography></Paper>} />
                    <Route path="/robot-status" element={<Paper sx={{ padding: 3, borderRadius: 2 }}><Typography variant="h6">Robot Status Monitoring (Maybe animated icons?)</Typography></Paper>} />
                    <Route path="/requirements" element={<RequirementsList />} />
                    <Route path="/structured-test-cases" element={<TestCases structuredTests={testSuites} loading={loading && activeMenuItem === 'Structured Test Cases'} />} />
                    <Route path="/test-runs" element={<TestRunsList testRuns={testRuns} fetchError={fetchError} loading={loading && activeMenuItem === 'Test Runs'} />} />
                    <Route path="/defects" element={<DefectsList />} />
                    <Route path="/test-type-summary" element={<TestTypeSummary testTypeSummary={testTypeSummary} fetchError={fetchError} loading={loading && activeMenuItem === 'Test Type Summary'} />} />
                    <Route path="/transit-metrics-daily" element={<TransitMetricsDaily transitMetricsDaily={transitMetricsDaily} fetchError={fetchError} loading={loading && activeMenuItem === 'Transit Metrics Daily'} />} />
                </Routes>
            </Box>
        </Box>
    );
}

export default App;