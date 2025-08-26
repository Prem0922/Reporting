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

function RequirementsList() {
    const [requirements, setRequirements] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
    const [filterField, setFilterField] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filteredRequirements, setFilteredRequirements] = useState([]);
    const [hoveredRequirementId, setHoveredRequirementId] = useState(null);
    const [testCaseDetails, setTestCaseDetails] = useState(null);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    const requirementFields = [
        { value: 'requirement_id', label: 'Requirement ID' },
        { value: 'title', label: 'Title' },
        { value: 'description', label: 'Description' },
        { value: 'component', label: 'Component' },
        { value: 'priority', label: 'Priority' },
        { value: 'status', label: 'Status' },
        { value: 'jira_id', label: 'Jira ID' },
        { value: 'created_at', label: 'Created At' },
    ];

    useEffect(() => {
        setLoading(true);
        fetch('http://localhost:5000/api/requirements')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setRequirements(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching requirements:', error);
                setFetchError('Failed to load requirements.');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const safeData = Array.isArray(requirements) ? requirements : [];
        let filtered = safeData;

        if (filterField && filterValue) {
            filtered = safeData.filter(req => {
                const valueToCompare = req[filterField];
                const formattedDate = filterField === 'created_at' && valueToCompare ? format(new Date(valueToCompare), 'yyyy-MM-dd HH:mm:ss') : '';
                const searchTermRegex = new RegExp(filterValue, 'i');

                if (filterField === 'created_at' && formattedDate) {
                    return searchTermRegex.test(formattedDate);
                } else if (valueToCompare) {
                    return searchTermRegex.test(String(valueToCompare));
                }
                return false;
            });
        }
        setFilteredRequirements(filtered);
        setCurrentPage(1);
    }, [requirements, filterField, filterValue]);

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

    const handleRequirementIdHover = async (event, requirementId) => {
        setHoveredRequirementId(requirementId);
        if (requirementId !== hoveredRequirementId || !testCaseDetails) {
            try {
                const response = await fetch(`http://localhost:5000/api/testcases/by_requirement?requirementId=${requirementId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch test cases');
                }
                const data = await response.json();
                setTestCaseDetails(data);
            } catch (error) {
                console.error('Error fetching test cases:', error);
                setTestCaseDetails(null);
            }
        }
    };

    const handleRequirementIdLeave = () => {
        setHoveredRequirementId(null);
        setTestCaseDetails(null);
    };

    const handleUrlUpload = async (url) => {
        try {
            // First fetch the data from the mock API
            console.log('Fetching requirements data from:', url);
            const mockApiResponse = await fetch(url);
            if (!mockApiResponse.ok) {
                throw new Error(`Failed to fetch data from mock API: ${mockApiResponse.status}`);
            }
            const mockData = await mockApiResponse.json();
            console.log('Received mock requirements data:', mockData);

            // Send the entire array to our backend
            console.log('Sending requirements data to backend...');
            const response = await fetch('http://localhost:5000/api/requirements', {
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
            
            // Refresh the requirements list
            console.log('Refreshing requirements list...');
            const refreshResponse = await fetch('http://localhost:5000/api/requirements');
            if (!refreshResponse.ok) {
                throw new Error(`HTTP error! status: ${refreshResponse.status}`);
            }
            const refreshData = await refreshResponse.json();
            console.log('Received refreshed requirements data:', refreshData);

            // Update the UI
            setRequirements(refreshData);
            setUploadDialogOpen(false);

            // Show success message
            alert('Requirements uploaded successfully!');
        } catch (error) {
            console.error('Error uploading requirements:', error);
            alert(`Upload failed: ${error.message}`);
        }
    };

    const handleFileUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('http://localhost:5000/api/requirements/upload/file', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Upload failed');
            // Refresh the requirements list
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
    const currentItems = filteredRequirements.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(filteredRequirements.length / rowsPerPage);

    if (requirements.length === 0 && !loading) {
        return (
            <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                    <Typography variant="h4" sx={{ color: '#2196f3' }}>Requirements</Typography>
                    <Box sx={{ display: 'flex', gap: 2 }}>
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
                            Upload Requirements
                        </Button>
                    </Box>
                </Box>
                <Typography variant="body1">No requirements available.</Typography>

                <UploadOptions
                    title="Upload Requirements"
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
                <Typography variant="h4" sx={{ color: '#2196f3' }}>Requirements</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
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
                        Upload Requirements
                    </Button>
                </Box>
            </Box>

            {/* Upload Dialog */}
            <UploadOptions
                title="Upload Requirements"
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                onUrlUpload={handleUrlUpload}
                onFileUpload={handleFileUpload}
            />

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
                        {requirementFields.map(field => (
                            <MenuItem key={field.value} value={field.value}>{field.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label={`Search in ${requirementFields.find(f => f.value === filterField)?.label || 'All Fields'}`}
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
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Requirement ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Title</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Component</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Priority</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Jira ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', color: '#1976d2', fontSize: '1.1em' }}>Created At</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map(req => (
                            <TableRow key={req.requirement_id} sx={{ '&:nth-child(even)': { backgroundColor: '#f9f9f9' } }}>
                                <TableCell 
                                    component="th" 
                                    scope="row"
                                    onMouseEnter={(e) => handleRequirementIdHover(e, req.requirement_id)}
                                    onMouseLeave={handleRequirementIdLeave}
                                    style={{ position: 'relative' }}
                                >
                                    {req.requirement_id}
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
                                        {hoveredRequirementId === req.requirement_id && 
                                         currentItems.findIndex(r => r.requirement_id === req.requirement_id) === currentItems.indexOf(req) && 
                                         testCaseDetails && testCaseDetails.length > 0 && (
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
                                                            Related Test Cases:
                                                        </Typography>
                                                        {testCaseDetails.map((testCase, index) => (
                                                            <Box key={testCase.Test_Case_ID} sx={{ mb: 2, pb: 1, borderBottom: index < testCaseDetails.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                                                                <Typography sx={{ mb: 1 }}>
                                                                    <strong>Test Case ID:</strong> {testCase.Test_Case_ID}
                                                                </Typography>
                                                                <Typography sx={{ mb: 1 }}>
                                                                    <strong>Title:</strong> {testCase.Title}
                                                                </Typography>
                                                                <Typography sx={{ mb: 1 }}>
                                                                    <strong>Type:</strong> {testCase.Type}
                                                                </Typography>
                                                                <Typography sx={{ mb: 1 }}>
                                                                    <strong>Status:</strong> {testCase.Status}
                                                                </Typography>
                                                                <Typography sx={{ mb: 1 }}>
                                                                    <strong>Component:</strong> {testCase.Component}
                                                                </Typography>
                                                                <Typography sx={{ 
                                                                    mb: 1,
                                                                    whiteSpace: 'pre-wrap',
                                                                    wordBreak: 'break-word'
                                                                }}>
                                                                    <strong>PreCondition:</strong> {testCase.PreCondition || 'N/A'}
                                                                </Typography>
                                                                <Typography sx={{ 
                                                                    mb: 1,
                                                                    whiteSpace: 'pre-wrap',
                                                                    wordBreak: 'break-word'
                                                                }}>
                                                                    <strong>Test Steps:</strong> {testCase.Test_Steps || 'N/A'}
                                                                </Typography>
                                                                <Typography sx={{ 
                                                                    mb: 1,
                                                                    whiteSpace: 'pre-wrap',
                                                                    wordBreak: 'break-word'
                                                                }}>
                                                                    <strong>Expected Result:</strong> {testCase.Expected_Result || 'N/A'}
                                                                </Typography>
                                                            </Box>
                                                        ))}
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
                                <TableCell>{req.title}</TableCell>
                                <TableCell>{req.description}</TableCell>
                                <TableCell>{req.component}</TableCell>
                                <TableCell>{req.priority}</TableCell>
                                <TableCell>{req.status}</TableCell>
                                <TableCell>{req.jira_id}</TableCell>
                                <TableCell>{req.created_at ? format(new Date(req.created_at), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                        {filteredRequirements.length === 0 && filterValue && (
                            <TableRow>
                                <TableCell colSpan={8} align="center">No requirements found matching the filter.</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {filteredRequirements.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, marginTop: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ mr: 2, mb: { xs: 1, sm: 0 } }}>
                        Showing {filteredRequirements.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredRequirements.length)} of {filteredRequirements.length} items
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                        <FormControl size="small" sx={{ m: 1, minWidth: 70, mr: 2 }}>
                            <InputLabel id="req-rows-per-page-label">Rows</InputLabel>
                            <Select
                                labelId="req-rows-per-page-label"
                                id="req-rows-per-page-select"
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
                        {filteredRequirements.length > rowsPerPage && (
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

export default RequirementsList;