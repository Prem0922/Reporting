import React, { useState, useEffect } from 'react';
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
    Box,                 // Added for layout
    Pagination,          // Added for page numbers
    Select,              // Added for rows per page
    MenuItem,            // Added for rows per page
    FormControl,         // Added for rows per page
    InputLabel,          // Added for rows per page
    TextField,           // Added for search
    Button              // Added for upload
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { format } from 'date-fns';
import UploadOptions from './components/UploadOptions';

const DEFAULT_ITEMS_PER_PAGE = 10; // Define a default

// StylizedValue component (can be kept here or moved to a shared utils file if used elsewhere)
const StylizedValue = ({ value, unit, color, fontSize }) => (
    <Typography sx={{ fontWeight: 'bold', color: color, ...(fontSize && { fontSize }) }}>
        {value}
        {unit && <span style={{ fontWeight: 'normal', marginLeft: 2 }}>{unit}</span>}
    </Typography>
);

// formatValue function (specific to TestTypeSummary)
function formatValue(value, metric) {
    if (value === null || value === undefined) {
        return 'N/A';
    }

    const lowerCaseMetric = metric.toLowerCase();
    let numericPart = String(value); // Ensure it's a string for matching
    let prefix = '';
    let suffix = '';

    // Check for and extract non-numeric prefixes like <, >, <=, >=
    const prefixMatch = numericPart.match(/^([<=>]+)/);
    if (prefixMatch && prefixMatch[1]) {
        prefix = prefixMatch[1];
        numericPart = numericPart.substring(prefixMatch[1].length);
    }

    // Check for and extract non-numeric suffixes like %, ms, etc.
    // Ensure this doesn't incorrectly grab parts of numbers if not careful
    const suffixMatch = numericPart.match(/([a-zA-Z%]+)$/);
    if (suffixMatch && suffixMatch[1] && isNaN(parseFloat(suffixMatch[1]))) { // check if suffix is not a number part
        suffix = suffixMatch[1];
        numericPart = numericPart.substring(0, numericPart.length - suffix.length);
    }
    
    // Attempt to convert the remaining numericPart to a number
    const num = parseFloat(numericPart);

    if (isNaN(num)) { // If still not a number after stripping, return original value or N/A
        return value;
    }

    if (lowerCaseMetric.includes('percentage') || lowerCaseMetric.includes('success rate') || suffix === '%') {
        return `${prefix}${num.toFixed(2)}${suffix || '%'}`;
    } else if (lowerCaseMetric.includes('time') || lowerCaseMetric.includes('duration') || suffix.toLowerCase() === 'ms' || suffix.toLowerCase() === 's') {
        return `${prefix}${num.toFixed(0)}${suffix || 'ms'}`;
    } else if (lowerCaseMetric.includes('count') || lowerCaseMetric.includes('retries')) {
        return `${prefix}${num.toFixed(0)}${suffix}`;
    } else {
        return `${prefix}${num}${suffix}`; // Default formatting
    }
}


function TestTypeSummary({ testTypeSummary, fetchError: appFetchError, loading: appLoading }) {
    // Note: This component can also fetch its own data if testTypeSummary prop is not provided.
    // For now, it primarily relies on the prop passed from App.js.
    const [internalLoading, setInternalLoading] = useState(false);
    const [internalError, setInternalError] = useState(null);
    const [dataToDisplay, setDataToDisplay] = useState([]);
    const [filterField, setFilterField] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);

    const testTypeFields = [
        { value: 'Test_Type', label: 'Test Type' },
        { value: 'Metrics', label: 'Metrics' },
        { value: 'Expected', label: 'Expected' },
        { value: 'Actual', label: 'Actual' },
        { value: 'Status', label: 'Status' },
        { value: 'Test_Date', label: 'Test Date' }
    ];

    useEffect(() => {
        if (testTypeSummary) {
            setDataToDisplay(testTypeSummary);
            setFilteredData(testTypeSummary);
            setCurrentPage(1); // Reset page when new data comes from props
        }
    }, [testTypeSummary]);

    useEffect(() => {
        const safeData = Array.isArray(dataToDisplay) ? dataToDisplay : [];
        let filtered = safeData;

        if (filterField && filterValue) {
            filtered = safeData.filter(item => {
                const valueToCompare = item[filterField];
                if (filterField === 'Test_Date' && valueToCompare) {
                    const formattedDate = format(new Date(valueToCompare), 'yyyy-MM-dd');
                    return formattedDate.toLowerCase().includes(filterValue.toLowerCase());
                }
                return valueToCompare && String(valueToCompare).toLowerCase().includes(filterValue.toLowerCase());
            });
        }
        setFilteredData(filtered);
        setCurrentPage(1);
    }, [dataToDisplay, filterField, filterValue]);

    const handleFilterFieldChange = (event) => {
        setFilterField(event.target.value);
        setFilterValue('');
    };

    const handleFilterValueChange = (event) => {
        setFilterValue(event.target.value);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1); // Reset to first page when rows per page changes
    };

    const handleUrlUpload = async (url) => {
        try {
            // First fetch the data from the mock API
            console.log('Fetching test type summary data from:', url);
            const mockApiResponse = await fetch(url);
            if (!mockApiResponse.ok) {
                throw new Error(`Failed to fetch data from mock API: ${mockApiResponse.status}`);
            }
            const mockData = await mockApiResponse.json();
            console.log('Received mock test type summary data:', mockData);

            // Send the entire array to our backend
            console.log('Sending test type summary data to backend...');
            const response = await fetch('http://localhost:5000/api/testtypesummary', {
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
            
            // Refresh the test type summary list
            if (testTypeSummary) {
                setDataToDisplay(testTypeSummary);
                setFilteredData(testTypeSummary);
            }
            setUploadDialogOpen(false);

            // Show success message
            alert('Test type summary uploaded successfully!');
        } catch (error) {
            console.error('Error uploading test type summary:', error);
            alert(`Upload failed: ${error.message}`);
        }
    };

    const handleFileUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('http://localhost:5000/api/testtypesummary/upload/file', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Upload failed');
            if (testTypeSummary) {
                setDataToDisplay(testTypeSummary);
                setFilteredData(testTypeSummary);
            }
            setUploadDialogOpen(false);
            alert('File uploaded successfully!');
        } catch (error) {
            console.error('Error uploading file:', error);
            alert(`Upload failed: ${error.message}`);
        }
    };

    const loading = appLoading || internalLoading;
    const fetchError = appFetchError || internalError;

    if (loading) {
        return <LinearProgress sx={{ margin: 2 }} />;
    }

    if (fetchError) {
        return <div style={{ color: 'red', fontWeight: 'bold', margin: '20px' }}>Error: {fetchError}</div>;
    }

    const safeData = Array.isArray(filteredData) ? filteredData : [];

    // Pagination logic
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = safeData.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(safeData.length / rowsPerPage);

    if (safeData.length === 0 && !loading) {
        return (
            <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <Typography variant="h4" sx={{ color: '#2196f3' }}>Test Type Summary</Typography>
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
                        Upload Test Type Summary
                    </Button>
                </Box>
                <Typography variant="body1">No test type summary data available.</Typography>

                <UploadOptions
                    title="Upload Test Type Summary"
                    open={uploadDialogOpen}
                    onClose={() => setUploadDialogOpen(false)}
                    onUrlUpload={handleUrlUpload}
                    onFileUpload={handleFileUpload}
                />
            </Paper>
        );
    }

    return (
        <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <Typography variant="h4" sx={{ color: '#2196f3' }}>Test Type Summary</Typography>
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
                    Upload Test Type Summary
                </Button>
            </Box>

            <UploadOptions
                title="Upload Test Type Summary"
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                onUrlUpload={handleUrlUpload}
                onFileUpload={handleFileUpload}
            />

            {/* Filter controls */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                <FormControl sx={{ m: 1, minWidth: 150 }}>
                    <InputLabel id="filter-field-label">Filter By</InputLabel>
                    <Select
                        labelId="filter-field-label"
                        id="filter-field"
                        value={filterField}
                        label="Filter By"
                        onChange={handleFilterFieldChange}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {testTypeFields.map(field => (
                            <MenuItem key={field.value} value={field.value}>{field.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label={`Search in ${testTypeFields.find(f => f.value === filterField)?.label || 'All Fields'}`}
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    sx={{ m: 1, flexGrow: 1 }}
                    disabled={!filterField}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead sx={{ backgroundColor: '#e0f2f7' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Test Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Metrics</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Expected</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Actual</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Test Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map((summary, index) => ( // Map over currentItems
                            <TableRow key={index} sx={{ '&:nth-child(even)': { backgroundColor: '#f9f9f9' } }}>
                                <TableCell><StylizedValue value={summary.Test_Type} unit="" color="#757575" /></TableCell>
                                <TableCell>{summary.Metrics}</TableCell>
                                <TableCell>{formatValue(summary.Expected, summary.Metrics)}</TableCell>
                                <TableCell>{formatValue(summary.Actual, summary.Metrics)}</TableCell>
                                <TableCell style={{ color: summary.Status === 'Pass' ? 'green' : 'red' }}>{summary.Status}</TableCell>
                                <TableCell>{summary.Test_Date ? format(new Date(summary.Test_Date), 'yyyy-MM-dd') : 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Combined Pagination Controls */}
            {safeData.length > 0 && (
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, marginTop: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ mr: 2, mb: { xs: 1, sm: 0 } }}>
                        Showing {safeData.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, safeData.length)} of {safeData.length} items
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ m: 1, minWidth: 70, mr: 2 }}>
                            <InputLabel id="tts-rows-per-page-label">Rows</InputLabel>
                            <Select
                                labelId="tts-rows-per-page-label"
                                id="tts-rows-per-page-select"
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
                        {safeData.length > rowsPerPage && (
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

export default TestTypeSummary;