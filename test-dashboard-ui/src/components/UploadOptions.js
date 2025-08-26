import React, { useState } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    TextField,
    Typography,
    IconButton,
    Paper,
    Divider,
    Tooltip
} from '@mui/material';
import {
    CloudUpload,
    Link as LinkIcon,
    Close as CloseIcon,
    FileUpload as FileUploadIcon
} from '@mui/icons-material';

const VALID_URLS = {
    'Upload Requirements': 'http://localhost:5001/mock_testrail/requirements',
    'Upload Test Cases': 'http://localhost:5001/mock_testrail/testcases',
    'Upload Test Runs': 'http://localhost:5001/mock_testrail/testruns',
    'Upload Defects': 'http://localhost:5001/mock_testrail/defects',
    'Upload Test Type Summary': 'http://localhost:5001/mock_testrail/testtypesummary',
    'Upload Transit Metrics': 'http://localhost:5001/mock_testrail/transitmetricsdaily'
};

const UploadOptions = ({ title, onUrlUpload, onFileUpload, open, onClose }) => {
    const [url, setUrl] = useState('');
    const [file, setFile] = useState(null);
    const [urlError, setUrlError] = useState('');
    const [fileError, setFileError] = useState('');

    const handleUrlSubmit = () => {
        if (!url) {
            setUrlError('Please enter a URL');
            return;
        }

        try {
            new URL(url);
            const validUrl = VALID_URLS[title];
            
            if (!validUrl) {
                setUrlError('Invalid component type');
                return;
            }

            if (url !== validUrl) {
                setUrlError(`Invalid URL. Please use: ${validUrl}`);
                return;
            }

            onUrlUpload(url);
            setUrl('');
            setUrlError('');
            onClose();
        } catch (e) {
            setUrlError('Please enter a valid URL');
        }
    };

    const handleFileSubmit = () => {
        if (!file) {
            setFileError('Please select a file');
            return;
        }
        onFileUpload(file);
        setFile(null);
        setFileError('');
        onClose();
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setFileError('');
        }
    };

    const validUrl = VALID_URLS[title];
    const helperText = validUrl ? `Please use: ${validUrl}` : urlError;

    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    backgroundColor: '#f8f9fa'
                }
            }}
        >
            <DialogTitle sx={{ 
                m: 0, 
                p: 2, 
                backgroundColor: '#303f9f',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CloudUpload />
                    <Typography variant="h6">{title}</Typography>
                </Box>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 2 }}>
                    {/* URL Upload Section */}
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <LinkIcon color="primary" />
                            Upload via URL
                        </Typography>
                        <TextField
                            fullWidth
                            label="Enter URL"
                            variant="outlined"
                            value={url}
                            onChange={(e) => {
                                setUrl(e.target.value);
                                setUrlError('');
                            }}
                            error={!!urlError}
                            helperText={helperText}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleUrlSubmit}
                            sx={{
                                backgroundColor: '#303f9f',
                                '&:hover': {
                                    backgroundColor: '#1a237e'
                                }
                            }}
                        >
                            Upload from URL
                        </Button>
                    </Paper>

                    <Divider>OR</Divider>

                    {/* File Upload Section */}
                    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <FileUploadIcon color="primary" />
                            Upload from File
                        </Typography>
                        <Box
                            sx={{
                                border: '2px dashed #303f9f',
                                borderRadius: 2,
                                p: 3,
                                textAlign: 'center',
                                mb: 2,
                                cursor: 'pointer',
                                '&:hover': {
                                    backgroundColor: 'rgba(48, 63, 159, 0.04)'
                                }
                            }}
                            onClick={() => document.getElementById('file-input').click()}
                        >
                            <input
                                id="file-input"
                                type="file"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <CloudUpload sx={{ fontSize: 48, color: '#303f9f', mb: 1 }} />
                            <Typography>
                                {file ? file.name : 'Drag and drop a file here or click to browse'}
                            </Typography>
                            {fileError && (
                                <Typography color="error" sx={{ mt: 1 }}>
                                    {fileError}
                                </Typography>
                            )}
                        </Box>
                        <Button
                            variant="contained"
                            onClick={handleFileSubmit}
                            disabled={!file}
                            sx={{
                                backgroundColor: '#303f9f',
                                '&:hover': {
                                    backgroundColor: '#1a237e'
                                }
                            }}
                        >
                            Upload File
                        </Button>
                    </Paper>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default UploadOptions; 