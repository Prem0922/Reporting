import React, { useState, useEffect, useMemo } from 'react';
import {
    ListAlt,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import {
    Paper,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    LinearProgress,
    Box,
    TablePagination, // Keep TablePagination for more granular control over rowsPerPageOptions
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Tooltip,
    List,
    ListItem,
    IconButton,
    TextField, // Used for the filter value input
    Button
} from '@mui/material';
import { format } from 'date-fns';
import UploadOptions from './components/UploadOptions';

const DEFAULT_ITEMS_PER_PAGE = 10;

const StylizedValue = ({ value, unit, color, fontSize }) => (
    <Typography sx={{ fontWeight: 'bold', color: color, ...(fontSize && { fontSize }) }}>
        {value}
        {unit && <span style={{ fontWeight: 'normal', marginLeft: 2 }}>{unit}</span>}
    </Typography>
);

function TestCases({ structuredTests, loading }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ITEMS_PER_PAGE);
    const [hoveredRequirementId, setHoveredRequirementId] = useState(null);
    const [requirementDetails, setRequirementDetails] = useState(null);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

    // Filter states similar to RequirementsList.js
    const [filterField, setFilterField] = useState('');
    const [filterValue, setFilterValue] = useState('');

    const testCaseFields = [
        { value: 'Test_Case_ID', label: 'Test Case ID' },
        { value: 'Title', label: 'Title' },
        { value: 'Type', label: 'Type' },
        { value: 'Status', label: 'Status' },
        { value: 'Component', label: 'Component' },
        { value: 'Requirement_ID', label: 'Requirement ID' },
        { value: 'Created_by', label: 'Created By' },
        { value: 'Created_at', label: 'Created At' },
        { value: 'PreCondition', label: 'PreCondition' },
        { value: 'Test_Steps', label: 'Test Steps' },
        { value: 'Expected_Result', label: 'Expected Result' },
    ];

    useEffect(() => {
        setCurrentPage(1); // Reset page whenever structuredTests, filterField, or filterValue changes
    }, [structuredTests, filterField, filterValue]);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setCurrentPage(1);
    };

    const handleFilterFieldChange = (event) => {
        setFilterField(event.target.value);
        setFilterValue(''); // Clear filter value when field changes
    };

    const handleFilterValueChange = (event) => {
        setFilterValue(event.target.value);
    };

    const getRequirementDetails = async (requirementId) => {
        try {
            const response = await fetch(`http://localhost:5000/api/requirements/${requirementId}`);
            if (response.status === 404) return null;
            if (!response.ok) return null;
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching requirement details:', error);
            return null;
        }
    };

    const handleRequirementIdHover = (event, requirementId) => {
        setHoveredRequirementId(requirementId);
        if (requirementId !== hoveredRequirementId || !requirementDetails) {
            getRequirementDetails(requirementId).then(details => {
                setRequirementDetails(details);
            });
        }
    };

    const handleRequirementIdLeave = () => {
        setHoveredRequirementId(null);
        setRequirementDetails(null);
    };

    const safeStructuredTests = Array.isArray(structuredTests) ? structuredTests : [];

    // Filter logic based on RequirementsList.js
    const filteredTests = useMemo(() => {
        let filtered = safeStructuredTests;

        if (filterField && filterValue) {
            const searchTermRegex = new RegExp(filterValue, 'i'); // Case-insensitive regex
            filtered = safeStructuredTests.filter(test => {
                const valueToCompare = test[filterField];

                if (filterField === 'Created_at' && valueToCompare) {
                    const formattedDate = format(new Date(valueToCompare), 'yyyy-MM-dd HH:mm:ss');
                    return searchTermRegex.test(formattedDate);
                } else if (valueToCompare !== undefined && valueToCompare !== null) {
                    return searchTermRegex.test(String(valueToCompare));
                }
                return false;
            });
        }
        return filtered;
    }, [safeStructuredTests, filterField, filterValue]);

    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    const currentItems = filteredTests.slice(indexOfFirstItem, indexOfLastItem);
    const pageCount = Math.ceil(filteredTests.length / rowsPerPage);

    const handleUrlUpload = async (url) => {
        try {
            // Fetch the data from the mock API
            const mockApiResponse = await fetch(url);
            if (!mockApiResponse.ok) {
                throw new Error(`Failed to fetch data from mock API: ${mockApiResponse.status}`);
            }
            const mockData = await mockApiResponse.json();
            // Send the entire array to our backend
            const response = await fetch('http://localhost:5000/api/testcases', {
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
            // Optionally refresh the list here if you have a fetchStructuredTests function
            setUploadDialogOpen(false);
            alert('Test cases uploaded successfully!');
        } catch (error) {
            alert(`Upload failed: ${error.message}`);
        }
    };

    const handleFileUpload = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            const response = await fetch('http://localhost:5000/api/testcases/upload/file', {
                method: 'POST',
                body: formData
            });
            if (!response.ok) throw new Error('Upload failed');
            // Optionally refresh the list here if you have a fetchStructuredTests function
            setUploadDialogOpen(false);
            alert('Test cases uploaded successfully!');
        } catch (error) {
            alert(`Upload failed: ${error.message}`);
        }
    };

    // Helper to get field value case-insensitively
    const getField = (row, key) => {
        if (!row) return '';
        const lowerKey = key.toLowerCase();
        const foundKey = Object.keys(row).find(k => k.toLowerCase() === lowerKey);
        return foundKey ? row[foundKey] : '';
    };

    if (loading) { return <LinearProgress sx={{ margin: 2 }} />; }

    if (safeStructuredTests.length === 0 && !loading) {
        return (
            <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" sx={{ marginBottom: 3, color: '#2196f3' }}>
                    <ListAlt sx={{ marginRight: 1 }} /> Test Cases
                </Typography>
                <Typography variant="body1">No structured test cases available.</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <Typography variant="h4" sx={{ color: '#2196f3' }}>
                    <ListAlt sx={{ marginRight: 1, verticalAlign: "middle" }} /> Structured Test Cases
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<MoreVertIcon />}
                    onClick={() => setUploadDialogOpen(true)}
                    sx={{ backgroundColor: '#303f9f', '&:hover': { backgroundColor: '#1a237e' } }}
                >
                    Upload Test Cases
                </Button>
            </Box>
            <UploadOptions
                title="Upload Test Cases"
                open={uploadDialogOpen}
                onClose={() => setUploadDialogOpen(false)}
                onUrlUpload={handleUrlUpload}
                onFileUpload={handleFileUpload}
            />

            {/* Filter and Search Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2, gap: 2, flexWrap: 'wrap' }}>
                <FormControl sx={{ minWidth: 180 }} size="small">
                    <InputLabel id="filter-field-label">Filter By</InputLabel>
                    <Select
                        labelId="filter-field-label"
                        id="filter-field"
                        value={filterField}
                        label="Filter By"
                        onChange={handleFilterFieldChange}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        {testCaseFields.map(field => (
                            <MenuItem key={field.value} value={field.value}>{field.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label={filterField ? `Search in ${testCaseFields.find(f => f.value === filterField)?.label}` : 'Enter value to filter'}
                    variant="outlined"
                    size="small"
                    value={filterValue}
                    onChange={handleFilterValueChange}
                    sx={{ flexGrow: 1, minWidth: 200 }}
                    disabled={!filterField} // Disable input if no filter field is selected
                />
            </Box>

            {filteredTests.length > 0 ? (
                <>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead sx={{ backgroundColor: '#e0f2f7' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Test Case ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Title</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Type</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Component</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Requirement ID</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Created By</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Created At</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>PreCondition</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Test Steps</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold', color: '#1976d2' }}>Expected Result</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentItems.map(row => (
                                    <TableRow key={getField(row, 'Test_Case_ID')}>
                                        <TableCell>{getField(row, 'Test_Case_ID')}</TableCell>
                                        <TableCell>{getField(row, 'Title')}</TableCell>
                                        <TableCell>{getField(row, 'Type')}</TableCell>
                                        <TableCell>{getField(row, 'Status')}</TableCell>
                                        <TableCell>{getField(row, 'Component')}</TableCell>
                                        <TableCell 
                                            onMouseEnter={(e) => handleRequirementIdHover(e, getField(row, 'Requirement_ID'))}
                                            onMouseLeave={handleRequirementIdLeave}
                                            style={{ position: 'relative' }}
                                        >
                                            {getField(row, 'Requirement_ID')}
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
                                                {hoveredRequirementId === getField(row, 'Requirement_ID') && 
                                                 currentItems.findIndex(t => t.Requirement_ID === getField(row, 'Requirement_ID')) === currentItems.indexOf(row) && 
                                                 requirementDetails && (
                                                    <Tooltip 
                                                        open 
                                                        title={
                                                            <Box sx={{ 
                                                                p: 1, 
                                                                backgroundColor: '#424242',
                                                                borderRadius: 1,
                                                                minWidth: 300,
                                                                '& .MuiTypography-root': {
                                                                    fontSize: '0.875rem',
                                                                    color: '#fff'
                                                                }
                                                            }}>
                                                                <Typography sx={{ mb: 1 }}>
                                                                    <strong>Requirement ID:</strong> {requirementDetails.requirement_id}
                                                                </Typography>
                                                                <Typography sx={{ mb: 1 }}>
                                                                    <strong>Title:</strong> {requirementDetails.title}
                                                                </Typography>
                                                                <Typography sx={{ 
                                                                    mb: 1,
                                                                    whiteSpace: 'pre-wrap',
                                                                    wordBreak: 'break-word'
                                                                }}>
                                                                    <strong>Description:</strong> {requirementDetails.description}
                                                                </Typography>
                                                                <Typography sx={{ mb: 1 }}>
                                                                    <strong>Component:</strong> {requirementDetails.component}
                                                                </Typography>
                                                                <Typography sx={{ mb: 1 }}>
                                                                    <strong>Priority:</strong> {requirementDetails.priority}
                                                                </Typography>
                                                                <Typography sx={{ mb: 1 }}>
                                                                    <strong>Jira ID:</strong> {requirementDetails.jira_id}
                                                                </Typography>
                                                                <Typography sx={{ mb: 1 }}>
                                                                    <strong>Created At:</strong> {requirementDetails.created_at ? format(new Date(requirementDetails.created_at), 'yyyy-MM-dd HH:mm:ss') : 'N/A'}
                                                                </Typography>
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
                                        <TableCell>{getField(row, 'Created_By') || getField(row, 'Created_by') || 'N/A'}</TableCell>
                                        <TableCell>{getField(row, 'Created_At') || getField(row, 'Created_at') || 'N/A'}</TableCell>
                                        <TableCell>{getField(row, 'PreCondition') || 'N/A'}</TableCell>
                                        <TableCell>
                                            <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', margin: 0 }}>
                                                {getField(row, 'Test_Steps') || 'N/A'}
                                            </pre>
                                        </TableCell>
                                        <TableCell>{getField(row, 'Expected_Result') || 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, marginTop: 2, flexWrap: 'wrap' }}>
                        <Typography variant="body2" sx={{ mr: 2, mb: { xs: 1, sm: 0 } }}>
                            Showing {filteredTests.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredTests.length)} of {filteredTests.length} items
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                            <FormControl size="small" sx={{ m: 1, minWidth: 70, mr: 2 }}>
                                <InputLabel id="stc-rows-per-page-label">Rows</InputLabel>
                                <Select
                                    labelId="stc-rows-per-page-label"
                                    id="stc-rows-per-page-select"
                                    value={rowsPerPage}
                                    label="Rows"
                                    onChange={handleChangeRowsPerPage}
                                >
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={25}>25</MenuItem>
                                    <MenuItem value={50}>50</MenuItem>
                                    <MenuItem value={-1}>All</MenuItem>
                                </Select>
                            </FormControl>
                            {/* Using TablePagination as it handles rowsPerPageOptions and count correctly */}
                            {filteredTests.length > 0 && (
                                <TablePagination
                                    component="div"
                                    count={filteredTests.length}
                                    rowsPerPage={rowsPerPage}
                                    page={currentPage - 1} // Material UI Pagination uses 0-based index
                                    onPageChange={(event, newPage) => handlePageChange(event, newPage + 1)}
                                    rowsPerPageOptions={[5, 10, 25, 50, { label: 'All', value: -1 }]}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            )}
                        </Box>
                    </Box>
                </>
            ) : (
                !loading && (filterField || filterValue) && <Typography variant="body1">No test cases found matching your filter.</Typography>
            )}
            {/* Display message if there are no test cases and no active filters/search */}
            {filteredTests.length === 0 && !loading && !filterField && !filterValue && (
                <Typography variant="body1">No structured test cases available.</Typography>
            )}
        </Paper>
    );
}

export default TestCases;