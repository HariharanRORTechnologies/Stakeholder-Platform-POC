import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  Button,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { markAsDownloaded } from '../features/mockData/store/certificatesSlice';
import { Download as DownloadIcon, Visibility as ViewIcon } from '@mui/icons-material';

export function CertificatesPage() {
  const dispatch = useDispatch();
  const certificates = useSelector((state: RootState) => state.mockCertificates.items);
  const [selectedCert, setSelectedCert] = useState<any>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleDownload = (certId: number) => {
    dispatch(markAsDownloaded(certId));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
        Certificates
      </Typography>

      <Grid container spacing={3}>
        {certificates.map((cert) => (
          <Grid item xs={12} sm={6} md={4} key={cert.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="div"
                sx={{
                  height: 200,
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '3rem',
                }}
              >
                🎓
              </CardMedia>
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {cert.eventTitle}
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  By {cert.userName}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip
                    label={cert.status}
                    size="small"
                    color={cert.status === 'downloaded' ? 'success' : 'default'}
                  />
                  <Typography variant="caption">
                    {new Date(cert.issuedDate).toLocaleDateString()}
                  </Typography>
                </Stack>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 2 }}>
                  Code: {cert.verificationCode}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Button
                    size="small"
                    variant="outlined"
                    fullWidth
                    startIcon={<ViewIcon />}
                    onClick={() => {
                      setSelectedCert(cert);
                      setPreviewOpen(true);
                    }}
                  >
                    View
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    startIcon={<DownloadIcon />}
                    onClick={() => handleDownload(cert.id)}
                  >
                    Download
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Certificate Preview Dialog */}
      <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md">
        <DialogTitle>Certificate Preview</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              mt: 2,
              p: 4,
              backgroundColor: '#fff8e1',
              border: '3px solid #b8860b',
              textAlign: 'center',
              borderRadius: 2,
            }}
          >
            <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2, color: '#b8860b' }}>
              Certificate of Participation
            </Typography>
            <Typography variant="h6" sx={{ mb: 1 }}>
              This certifies that
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 'bold', my: 2 }}>
              {selectedCert?.userName}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Has successfully participated in
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
              {selectedCert?.eventTitle}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Issued on {selectedCert ? new Date(selectedCert.issuedDate).toLocaleDateString() : ''}
            </Typography>
            <Typography variant="caption" sx={{ display: 'block', mt: 2, color: '#666' }}>
              Verification Code: {selectedCert?.verificationCode}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Download PDF
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default { CertificatesPage };
