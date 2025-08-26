import React, { useState, useEffect } from 'react'; // useEffect might not be strictly needed if not fetching data internally
import {
    Typography,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    LinearProgress,
    Box,        // Import Box for layout
    Pagination,  // Import Pagination
    Select,      // Added for filter dropdown
    MenuItem,    // Added for filter options
    FormControl, // Added for filter layout
    InputLabel,  // Added for filter label
    TextField,   // Added for search input
    Button
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { format } from 'date-fns';
import UploadOptions from './components/UploadOptions';

const ITEMS_PER_PAGE = 10; // Define how many items to show per page

function TransitMetricsDaily({ transitMetricsDaily, fetchError, loading }) {
    const [currentPage, setCurrentPage] = useState(1); // State for current page
    const [rowsPerPage, setRowsPerPage] = useState(ITEMS_PER_PAGE);
    const [filterField, setFilterField] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    // Reset to page 1 if the transitMetricsDaily data changes (e.g., due to new fetch in parent)
    useEffect(() => {
        setCurrentPage(1);
    }, [transitMetricsDaily]);

    // Function to standardize the keys of a metric object
    const standardizeKeys = (metric) => {
        return {
            date: metric.date || metric.Date,
            fvm_transactions: metric.fvm_transactions || metric.FVM_Transactions || metric['FVM Transactions'],
            gate_taps: metric.gate_taps || metric.Gate_Taps || metric['Gate Taps'],
            bus_taps: metric.bus_taps || metric.Bus_Taps || metric['Bus Taps'],
            success_rate_gate: metric.success_rate_gate || metric.Success_Rate_Gate || metric['Success Rate Gate'],
            success_rate_bus: metric.success_rate_bus || metric.Success_Rate_Bus || metric['Success Rate Bus'],
            avg_response_time: metric.avg_response_time || metric.Avg_Response_Time || metric['Avg Response Time'],
            defect_count: metric.defect_count || metric.Defect_Count || metric['Defect Count'],
            notes: metric.notes || metric.Notes,
        };
    };

    // Initialize filtered data when transitMetricsDaily changes
    useEffect(() => {
        if (transitMetricsDaily) {
            const standardizedMetrics = transitMetricsDaily.map(standardizeKeys);
            setFilteredData(standardizedMetrics);
            setCurrentPage(1);
        }
    }, [transitMetricsDaily]);

    // Handle filtering when filter conditions change
    useEffect(() => {
        if (transitMetricsDaily) {
            const standardizedMetrics = transitMetricsDaily.map(standardizeKeys);
            let filtered = standardizedMetrics;

            if (filterField && filterValue) {
                filtered = standardizedMetrics.filter(metric => {
                    const valueToCompare = metric[filterField];
                    if (!valueToCompare) return false;
                    return String(valueToCompare).toLowerCase().includes(filterValue.toLowerCase());
                });
            }
            setFilteredData(filtered);
            setCurrentPage(1);
        }
    }, [transitMetricsDaily, filterField, filterValue]);

    const handleFilterFieldChange = (event) => {
        setFilterField(event.target.value);
        setFilterValue('');
    };

    const handleFilterValueChange = (event) => {
        setFilterValue(event.target.value);
    };

    // Handle page change
    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleUrlUpload = async (url) => {
        try {
            // First fetch the data from the mock API
            console.log('Fetching transit metrics data from:', url);
            const mockApiResponse = await fetch(url);
            if (!mockApiResponse.ok) {
                throw new Error(`Failed to fetch data from mock API: ${mockApiResponse.status}`);
            }
            const mockData = await mockApiResponse.json();
            console.log('Received mock transit metrics data:', mockData);

            // Send the entire array to our backend
            console.log('Sending transit metrics data to backend...');
            const response = await fetch('http://localhost:5000/api/transitmetricsdaily', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(mockData)
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.error || 'Upload failed');
            }

            console.log('Upload success:', responseData.message);
            
            // Refresh the transit metrics list
            console.log('Refreshing transit metrics list...');
            const refreshResponse = await fetch('http://localhost:5000/api/transitmetricsdaily');
            if (!refreshResponse.ok) {
                throw new Error(`HTTP error! status: ${refreshResponse.status}`);
            }
            const refreshData = await refreshResponse.json();
            console.log('Received refreshed transit metrics data:', refreshData);

            // Update the UI
            setFilteredData(refreshData);
            setUploadDialogOpen(false);

            // Show success message
            alert('Transit metrics uploaded successfully!');
        } catch (error) {
            console.error('Error uploading transit metrics:', error);
            alert(`Upload failed: ${error.message}`);
        }
    };

    const handleFileUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('http://localhost:5000/api/transit-metrics/upload/file', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Upload failed');
            // Refresh the page to show new data
            window.location.reload();
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    if (loading) {
        return <LinearProgress sx={{ margin: 2 }} />;
    }

    if (fetchError) {
        return <div style={{ color: 'red', fontWeight: 'bold', margin: '20px' }}>Error: {fetchError}</div>;
    }

    if (!transitMetricsDaily || transitMetricsDaily.length === 0) {
        return (
            <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <Typography variant="h4" sx={{ color: '#1976d2' }}>Transit Metrics Daily</Typography>
                    <Button
                        variant="contained"
                        startIcon={<CloudUpload />}
                        onClick={() => setUploadDialogOpen(true)}
                        sx={{
                            backgroundColor: '#303f9f',
                            '&:hover': {
                                backgroundColor: '#1a237e'
                            }
                        }}
                    >
                        Upload Metrics
                    </Button>
                </Box>
                <Typography variant="body1">No transit metrics data available.</Typography>

                <UploadOptions
                    title="Upload Transit Metrics"
                    open={uploadDialogOpen}
                    onClose={() => setUploadDialogOpen(false)}
                    onUrlUpload={handleUrlUpload}
                    onFileUpload={handleFileUpload}
                />
            </Paper>
        );
    }

    // Calculate pagination
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(filteredData.length / rowsPerPage);

    return (
        <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <Typography variant="h4" sx={{ color: '#1976d2' }}>Transit Metrics Daily</Typography>
                <Button
                    variant="contained"
                    startIcon={<CloudUpload />}
                    onClick={() => setUploadDialogOpen(true)}
                    sx={{
                        backgroundColor: '#303f9f',
                        '&:hover': {
                            backgroundColor: '#1a237e'
                        }
                    }}
                >
                    Upload Metrics
                </Button>
            </Box>

            <UploadOptions
                title="Upload Transit Metrics"
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                onUrlUpload={handleUrlUpload}
                onFileUpload={handleFileUpload}
            />

            {/* Filter Controls */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Select
                    value={filterField}
                    onChange={handleFilterFieldChange}
                    displayEmpty
                    size="small"
                    sx={{ minWidth: 120 }}
                >
                    <MenuItem value="">Filter By</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="fvm_transactions">FVM Transactions</MenuItem>
                    <MenuItem value="gate_taps">Gate Taps</MenuItem>
                    <MenuItem value="bus_taps">Bus Taps</MenuItem>
                    <MenuItem value="success_rate_gate">Success Rate Gate</MenuItem>
                    <MenuItem value="success_rate_bus">Success Rate Bus</MenuItem>
                    <MenuItem value="avg_response_time">Avg Response Time</MenuItem>
                    <MenuItem value="defect_count">Defect Count</MenuItem>
                    <MenuItem value="notes">Notes</MenuItem>
                </Select>

                <TextField
                    size="small"
                    placeholder={filterField ? `Search in ${filterField.replace(/_/g, ' ')}` : 'Search in all fields'}
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    disabled={!filterField}
                    sx={{ flexGrow: 1 }}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 750 }} aria-label="transit metrics daily table">
                    <TableHead sx={{ backgroundColor: '#e0f2f7' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Date</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>FVM Transactions</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Gate Taps</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Bus Taps</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Success Rate Gate</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Success Rate Bus</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Avg Response Time</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Defect Count</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Notes</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map(metric => ( // Use currentItems for rendering
                            <TableRow key={metric.date} sx={{ '&:nth-child(even)': { backgroundColor: '#f9f9f9' } }}>
                                <TableCell component="th" scope="row">{metric.date ? format(new Date(metric.date), 'yyyy-MM-dd') : 'N/A'}</TableCell>
                                <TableCell>{metric.fvm_transactions}</TableCell>
                                <TableCell>{metric.gate_taps}</TableCell>
                                <TableCell>{metric.bus_taps}</TableCell>
                                <TableCell>{metric.success_rate_gate}</TableCell>
                                <TableCell>{metric.success_rate_bus}</TableCell>
                                <TableCell>{metric.avg_response_time}</TableCell>
                                <TableCell>{metric.defect_count}</TableCell>
                                <TableCell>{metric.notes}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {filteredData.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, marginTop: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ mr: 2, mb: { xs: 1, sm: 0 } }}>
                        Showing {filteredData.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredData.length)} of {filteredData.length} items
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ m: 1, minWidth: 70, mr: 2 }}>
                            <InputLabel id="tmd-rows-per-page-label">Rows</InputLabel>
                            <Select
                                labelId="tmd-rows-per-page-label"
                                id="tmd-rows-per-page-select"
                                value={rowsPerPage}
                                label="Rows"
                                onChange={handleChangeRowsPerPage}
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={25}>25</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                            </Select>
                        </FormControl>
                        {filteredData.length > rowsPerPage && (
                            <Pagination
                                count={pageCount}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                                shape="rounded"
                                size="small"
                            />
                        )}
                    </Box>
                </Box>
            )}
        </Paper>
    );
}

export default TransitMetricsDaily;