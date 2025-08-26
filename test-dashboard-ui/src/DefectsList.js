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
    Box,
    Pagination,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TextField,
    IconButton,
    Tooltip,
    List,
    ListItem,
    Button
} from '@mui/material';
import { format } from 'date-fns';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { CloudUpload } from '@mui/icons-material';
import UploadOptions from './components/UploadOptions';

const DEFAULT_ITEMS_PER_PAGE = 10;

function DefectsList() {
    const [defects, setDefects] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
    const [filterField, setFilterField] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filteredDefects, setFilteredDefects] = useState([]);
    const [hoveredDefectId, setHoveredDefectId] = useState(null);
    const [hoveredTestCaseId, setHoveredTestCaseId] = useState(null);
    const [structuredTestCaseDetails, setStructuredTestCaseDetails] = useState(null);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    const defectFields = [
        { value: 'DefectID', label: 'Defect ID' },
        { value: 'Title', label: 'Title' },
        { value: 'Severity', label: 'Severity' },
        { value: 'Status', label: 'Status' },
        { value: 'Test_Case_ID', label: 'Test Case ID' },
        { value: 'reported_by', label: 'Reported By' },
        { value: 'created_at', label: 'Created At' },
        { value: 'fixed_at', label: 'Fixed At' },
    ];

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5000/api/defects')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setDefects(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching defects:', error);
                setFetchError('Failed to load defects.');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const safeData = Array.isArray(defects) ? defects : [];
        let filtered = safeData;

        if (filterField && filterValue) {
            filtered = safeData.filter(defect => {
                const valueToCompare = defect[filterField];
                const formattedCreatedDate = filterField === 'created_at' && valueToCompare ? format(new Date(valueToCompare), 'yyyy-MM-dd HH:mm:ss') : '';
                const formattedFixedDate = filterField === 'fixed_at' && valueToCompare ? format(new Date(valueToCompare), 'yyyy-MM-dd HH:mm:ss') : '';
                const searchTermRegex = new RegExp(filterValue, 'i');

                if (filterField === 'created_at' && formattedCreatedDate) {
                    return searchTermRegex.test(formattedCreatedDate);
                } else if (filterField === 'fixed_at' && formattedFixedDate) {
                    return searchTermRegex.test(formattedFixedDate);
                } else if (valueToCompare) {
                    return searchTermRegex.test(String(valueToCompare));
                }
                return false;
            });
        }
        setFilteredDefects(filtered);
        setCurrentPage(1);
    }, [defects, filterField, filterValue]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleFilterFieldChange = (event) => {
        setFilterField(event.target.value);
        setFilterValue('');
    };

    const handleFilterValueChange = (event) => {
        setFilterValue(event.target.value);
    };

    const handleDefectIdHover = (event, defectId) => {
        setHoveredDefectId(defectId);
    };

    const handleDefectIdLeave = () => {
        setHoveredDefectId(null);
    };

    const fetchStructuredTestCaseDetails = (testCaseId) => {
        fetch(`http://localhost:5000/api/structuredtestcases/${testCaseId}`)
            .then(response => {
                if (!response.ok) {
                    console.error(`Error fetching test case details for ${testCaseId}:`, response.status);
                    setStructuredTestCaseDetails(null);
                    return null;
                }
                return response.json();
            })
            .then(data => {
                setStructuredTestCaseDetails(data);
            })
            .catch(error => {
                console.error('Error fetching test case details:', error);
                setStructuredTestCaseDetails(null);
            });
    };

    const handleTestCaseIdHover = (event, testCaseId) => {
        setHoveredTestCaseId(testCaseId);
        fetchStructuredTestCaseDetails(testCaseId);
    };

    const handleTestCaseIdLeave = () => {
        setHoveredTestCaseId(null);
        setStructuredTestCaseDetails(null);
    };

    const handleUrlUpload = async (url) => {
        try {
            // First fetch the data from the mock API
            console.log('Fetching defects data from:', url);
            const mockApiResponse = await fetch(url);
            if (!mockApiResponse.ok) {
                throw new Error(`Failed to fetch data from mock API: ${mockApiResponse.status}`);
            }
            const mockData = await mockApiResponse.json();
            console.log('Received mock defects data:', mockData);

            // Send the entire array to our backend
            console.log('Sending defects data to backend...');
            const response = await fetch('http://localhost:5000/api/defects', {
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
            
            // Refresh the defects list
            console.log('Refreshing defects list...');
            const refreshResponse = await fetch('http://localhost:5000/api/defects');
            if (!refreshResponse.ok) {
                throw new Error(`HTTP error! status: ${refreshResponse.status}`);
            }
            const refreshData = await refreshResponse.json();
            console.log('Received refreshed defects data:', refreshData);

            // Update the UI
            setDefects(refreshData);
            setUploadDialogOpen(false);

            // Show success message
            alert('Defects uploaded successfully!');
        } catch (error) {
            console.error('Error uploading defects:', error);
            alert(`Upload failed: ${error.message}`);
        }
    };

    const handleFileUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('http://localhost:5000/api/defects/upload/file', {
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

    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = filteredDefects.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(filteredDefects.length / rowsPerPage);

    if (defects.length === 0 && !loading) {
        return (
            <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <Typography variant="h4" sx={{ color: '#1976d2' }}>Defects</Typography>
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
                        Upload Defects
                    </Button>
                </Box>
                <Typography variant="body1">No defects available.</Typography>

                <UploadOptions
                    title="Upload Defects"
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
                <Typography variant="h4" sx={{ color: '#1976d2' }}>Defects</Typography>
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
                    Upload Defects
                </Button>
            </Box>

            <UploadOptions
                title="Upload Defects"
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
                        {defectFields.map(field => (
                            <MenuItem key={field.value} value={field.value}>{field.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label={`Search in ${defectFields.find(f => f.value === filterField)?.label || 'All Fields'}`}
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    sx={{ m: 1, flexGrow: 1 }}
                    disabled={!filterField}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 750 }} aria-label="defects table">
                    <TableHead sx={{ backgroundColor: '#e0f2f7' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Defect ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Severity</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Test Case ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Reported By</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Created At</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Fixed At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map(defect => (
                            <TableRow key={defect.DefectID} sx={{ '&:nth-child(even)': { backgroundColor: '#f9f9f9' } }}>
                                <TableCell component="th" scope="row">
                                    {defect.DefectID}
                                </TableCell>
                                <TableCell>{defect.Title}</TableCell>
                                <TableCell>{defect.Severity}</TableCell>
                                <TableCell>{defect.Status}</TableCell>
                                <TableCell
                                    onMouseEnter={(e) => handleTestCaseIdHover(e, defect.Test_Case_ID)}
                                    onMouseLeave={handleTestCaseIdLeave}
                                    style={{ position: 'relative' }}
                                >
                                    {defect.Test_Case_ID}
                                    <div style={{
                                        position: 'absolute',
                                        top: '50%',
                                        right: 0,
                                        transform: 'translateY(-50%)',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}>
                                        <IconButton size="small" aria-label="details">
                                            <MoreVertIcon />
                                        </IconButton>
                                        {hoveredTestCaseId === defect.Test_Case_ID && 
                                         currentItems.findIndex(item => item.Test_Case_ID === defect.Test_Case_ID) === currentItems.indexOf(defect) && 
                                         structuredTestCaseDetails && (
                                            <Tooltip 
                                                open 
                                                title={
                                                    <Box sx={{ 
                                                        p: 1, 
                                                        backgroundColor: '#424242',
                                                        borderRadius: 1,
                                                        minWidth: 300,
                                                        maxHeight: 400,
                                                        overflowY: 'auto',
                                                        '& .MuiTypography-root': {
                                                            fontSize: '0.875rem',
                                                            color: '#fff'
                                                        }
                                                    }}>
                                                        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                                                            Test Case Details:
                                                        </Typography>
                                                        <Box sx={{ mb: 2, pb: 1 }}>
                                                            <Typography sx={{ mb: 1 }}>
                                                                <strong>Test Case ID:</strong> {structuredTestCaseDetails.Test_Case_ID}
                                                            </Typography>
                                                            <Typography sx={{ mb: 1 }}>
                                                                <strong>Title:</strong> {structuredTestCaseDetails.Title}
                                                            </Typography>
                                                            <Typography sx={{ mb: 1 }}>
                                                                <strong>Type:</strong> {structuredTestCaseDetails.Type}
                                                            </Typography>
                                                            <Typography sx={{ mb: 1 }}>
                                                                <strong>Status:</strong> {structuredTestCaseDetails.Status}
                                                            </Typography>
                                                            <Typography sx={{ mb: 1 }}>
                                                                <strong>Component:</strong> {structuredTestCaseDetails.Component}
                                                            </Typography>
                                                            <Typography sx={{ 
                                                                mb: 1,
                                                                whiteSpace: 'pre-wrap',
                                                                wordBreak: 'break-word'
                                                            }}>
                                                                <strong>PreCondition:</strong> {structuredTestCaseDetails.PreCondition || 'N/A'}
                                                            </Typography>
                                                            <Typography sx={{ 
                                                                mb: 1,
                                                                whiteSpace: 'pre-wrap',
                                                                wordBreak: 'break-word'
                                                            }}>
                                                                <strong>Test Steps:</strong> {structuredTestCaseDetails.Test_Steps || 'N/A'}
                                                            </Typography>
                                                            <Typography sx={{ 
                                                                mb: 1,
                                                                whiteSpace: 'pre-wrap',
                                                                wordBreak: 'break-word'
                                                            }}>
                                                                <strong>Expected Result:</strong> {structuredTestCaseDetails.Expected_Result || 'N/A'}
                                                            </Typography>
                                                            <Typography sx={{ mb: 1 }}>
                                                                <strong>Requirement ID:</strong> {structuredTestCaseDetails.Requirement_ID || 'N/A'}
                                                            </Typography>
                                                            <Typography sx={{ mb: 1 }}>
                                                                <strong>Created By:</strong> {structuredTestCaseDetails.Created_by || structuredTestCaseDetails.Created_By || 'N/A'}
                                                            </Typography>
                                                            <Typography sx={{ mb: 1 }}>
                                                                <strong>Created At:</strong> {structuredTestCaseDetails.Created_at ? format(new Date(structuredTestCaseDetails.Created_at), 'yyyy-MM-dd HH:mm:ss') : (structuredTestCaseDetails.Created_At ? format(new Date(structuredTestCaseDetails.Created_At), 'yyyy-MM-dd HH:mm:ss') : 'N/A')}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                } 
                                                placement="right"
                                                PopperProps={{
                                                    sx: {
                                                        '& .MuiTooltip-tooltip': {
                                                            backgroundColor: '#424242',
                                                            maxWidth: 500
                                                        }
                                                    }
                                                }}
                                            >
                                                <div></div>
                                            </Tooltip>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>{defect.reported_by}</TableCell>
                                <TableCell>{defect.created_at ? format(new Date(defect.created_at), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}</TableCell>
                                <TableCell>{defect.fixed_at ? format(new Date(defect.fixed_at), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                        {filteredDefects.length === 0 && filterValue && (
                            <TableRow>
                                <TableCell colSpan={8} align="center">No defects found matching the filter.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination and Rows per page controls */}
            {filteredDefects.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, marginTop: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ mr: 2, mb: { xs: 1, sm: 0 } }}>
                        Showing {filteredDefects.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredDefects.length)} of {filteredDefects.length} items
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ m: 1, minWidth: 70, mr: 2 }}>
                            <InputLabel id="defects-rows-per-page-label">Rows</InputLabel>
                            <Select
                                labelId="defects-rows-per-page-label"
                                id="defects-rows-per-page-select"
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
                        {filteredDefects.length > rowsPerPage && (
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

export default DefectsList;