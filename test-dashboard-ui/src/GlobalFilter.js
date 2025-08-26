// GlobalFilter.js
import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import useFilterStore from '../../store/filterStore'; // Adjust path if needed

// Define all possible fields from all your tables
const allTableFields = [
    { value: 'requirement_id', label: 'Requirement ID (Requirements)' },
    { value: 'title', label: 'Title (Requirements, Structured Test Cases, Defects)' },
    { value: 'description', label: 'Description (Requirements)' },
    { value: 'component', label: 'Component (Requirements, Structured Test Cases)' },
    { value: 'priority', label: 'Priority (Requirements)' },
    { value: 'jira_id', label: 'Jira ID (Requirements)' },
    { value: 'created_at', label: 'Created At (Requirements, Structured Test Cases, Defects)' },
    { value: 'test_case_id', label: 'Test Case ID (Structured Test Cases, Test Runs, Defects)' },
    { value: 'type', label: 'Type (Structured Test Cases)' },
    { value: 'status', label: 'Status (Structured Test Cases, Defects)' },
    { value: 'run_id', label: 'Run ID (Test Runs)' },
    { value: 'execution_date', label: 'Execution Date (Test Runs)' },
    { value: 'result', label: 'Result (Test Runs)' },
    { value: 'observed_time', label: 'Observed Time (Test Runs)' },
    { value: 'executed_by', label: 'Executed By (Test Runs)' },
    { value: 'remarks', label: 'Remarks (Test Runs)' },
    { value: 'DefectID', label: 'Defect ID (Defects)' },
    { value: 'severity', label: 'Severity (Defects)' },
    { value: 'reported_by', label: 'Reported By (Defects)' },
    { value: 'fixed_at', label: 'Fixed At (Defects)' },
    { value: 'test_type', label: 'Test Type (Test Type Summary)' },
    { value: 'metrics', label: 'Metrics (Test Type Summary)' },
    { value: 'expected', label: 'Expected (Test Type Summary)' },
    { value: 'actual', label: 'Actual (Test Type Summary)' },
    { value: 'test_date', label: 'Test Date (Test Type Summary)' },
    { value: 'date', label: 'Date (Transit Metrics Daily)' },
    { value: 'fvm_transactions', label: 'FVM Transactions (Transit Metrics Daily)' },
    { value: 'gate_taps', label: 'Gate Taps (Transit Metrics Daily)' },
    { value: 'bus_taps', label: 'Bus Taps (Transit Metrics Daily)' },
    { value: 'success_rate_gate', label: 'Success Rate Gate (Transit Metrics Daily)' },
    { value: 'success_rate_bus', label: 'Success Rate Bus (Transit Metrics Daily)' },
    { value: 'avg_response_time', label: 'Avg. Response Time (Transit Metrics Daily)' },
    { value: 'defect_count', label: 'Defect Count (Transit Metrics Daily)' },
    { value: 'notes', label: 'Notes (Transit Metrics Daily)' },
];

function GlobalFilter() {
    const { filterField, filterValue, setFilter } = useFilterStore();

    const handleFilterChange = (event) => {
        setFilter(filterField, event.target.value);
    };

    const handleFieldChange = (event) => {
        setFilter(event.target.value, ''); // Clear value when field changes
    };

    return (
        <Paper elevation={3} sx={{ position: 'absolute', top: 16, right: 16, padding: 2, display: 'flex', gap: 2, alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.8)', zIndex: 1000 }}>
            <FormControl size="small">
                <InputLabel id="global-filter-field-label">Filter Field</InputLabel>
                <Select
                    labelId="global-filter-field-label"
                    id="global-filter-field-select"
                    value={filterField}
                    label="Filter Field"
                    onChange={handleFieldChange}
                >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {allTableFields.map(field => (
                        <MenuItem key={field.value} value={field.value}>{field.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                label="Filter Value"
                variant="outlined"
                size="small"
                value={filterValue}
                onChange={handleFilterChange}
                sx={{ width: 200 }}
            />
        </Paper>
    );
}

export default GlobalFilter;