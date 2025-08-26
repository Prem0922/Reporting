// GlobalSearchBar.js
import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';

// Define a list of common searchable fields. This can be expanded.
const searchableFields = [
    { value: 'Test_Case_ID', label: 'Test Case ID' },
    { value: 'Title', label: 'Title' },
    { value: 'Component', label: 'Component' },
    { value: 'Status', label: 'Status' },
    { value: 'Requirement_ID', label: 'Requirement ID' },
    { value: 'DefectID', label: 'Defect ID' },
    { value: 'run_id', label: 'Run ID' }, // from TestRuns
    { value: 'test_id', label: 'Test Suite ID (Dashboard)' } // from Dashboard (Test Suites)
];

function GlobalSearchBar({ onSearch, onClear, isSearchActive }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField, setSearchField] = useState(searchableFields[0].value); // Default to Test Case ID

    const handleSearch = () => {
        if (searchTerm.trim()) {
            onSearch(searchField, searchTerm.trim());
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        // setSearchField(searchableFields[0].value); // Optionally reset field
        onClear();
    }

    return (
        <Paper elevation={3} sx={{ padding: 2, marginBottom: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel id="global-search-field-label">Search Field</InputLabel>
                    <Select
                        labelId="global-search-field-label"
                        id="global-search-field-select"
                        value={searchField}
                        label="Search Field"
                        onChange={(e) => setSearchField(e.target.value)}
                    >
                        {searchableFields.map(field => (
                            <MenuItem key={field.value} value={field.value}>{field.label}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    label="Search Term"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ flexGrow: 1 }}
                    onKeyPress={(ev) => {
                        if (ev.key === 'Enter') {
                            handleSearch();
                            ev.preventDefault();
                        }
                    }}
                />
                <Button variant="contained" onClick={handleSearch} sx={{ height: '40px' }}>Search</Button>
                {isSearchActive && (
                    <Button variant="outlined" onClick={handleClear} sx={{ height: '40px' }}>Clear Search</Button>
                )}
            </Box>
        </Paper>
    );
}

export default GlobalSearchBar;