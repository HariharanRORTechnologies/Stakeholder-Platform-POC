import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Rating,
  TextField,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { addFeedback, deleteFeedback } from '../features/mockData/store/feedbackSlice';
import { showToast } from '../features/mockData/store/uiSlice';

export function FeedbackPage() {
  const dispatch = useDispatch();
  const feedback = useSelector((state: RootState) => state.mockFeedback.items);
  const events = useSelector((state: RootState) => state.mockEvents.items);
  const currentRole = useSelector((state: RootState) => state.ui.currentRole);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    content: '',
    eventId: events[0]?.id || 1,
  });

  const eventMap = new Map(events.map(e => [e.id, e]));

  const handleSubmitFeedback = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      dispatch(showToast({
        message: 'Please fill in all fields',
        type: 'error',
      }));
      return;
    }

    const newFeedback = {
      id: Math.max(...feedback.map(f => f.id), 0) + 1,
      eventId: formData.eventId,
      userId: Math.floor(Math.random() * 6) + 1,
      userName: 'Current User',
      rating: formData.rating,
      title: formData.title,
      content: formData.content,
      timestamp: new Date().toISOString(),
      isAnonymous: false,
    };

    dispatch(addFeedback(newFeedback));
    dispatch(showToast({
      message: 'Feedback submitted successfully!',
      type: 'success',
    }));
    setDialogOpen(false);
    setFormData({ rating: 5, title: '', content: '', eventId: events[0]?.id || 1 });
  };

  const avgRating = feedback.length > 0
    ? (feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length).toFixed(1)
    : 0;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Feedback
        </Typography>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>
          Submit Feedback
        </Button>
      </Stack>

      {/* Stats */}
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 3 }}>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Average Rating
            </Typography>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h5">{avgRating}</Typography>
              <Rating value={parseFloat(avgRating as string)} readOnly size="small" />
            </Stack>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent>
            <Typography color="textSecondary" gutterBottom>
              Total Responses
            </Typography>
            <Typography variant="h5">{feedback.length}</Typography>
          </CardContent>
        </Card>
      </Stack>

      {/* Feedback Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Feedback</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Event</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                Rating
              </TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              {['admin', 'manager'].includes(currentRole) && (
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>
                  Action
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {feedback.map((f) => (
              <TableRow key={f.id} hover>
                <TableCell>
                  <Stack>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {f.title}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {f.content.substring(0, 60)}...
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>{eventMap.get(f.eventId)?.title}</TableCell>
                <TableCell align="center">
                  <Rating value={f.rating} readOnly size="small" />
                </TableCell>
                <TableCell>
                  {f.isAnonymous ? 'Anonymous' : f.userName}
                </TableCell>
                <TableCell>{new Date(f.timestamp).toLocaleDateString()}</TableCell>
                {['admin', 'manager'].includes(currentRole) && (
                  <TableCell align="center">
                    <Button
                      size="small"
                      color="error"
                      onClick={() => {
                        dispatch(deleteFeedback(f.id));
                        dispatch(showToast({ message: 'Feedback deleted', type: 'info' }));
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Submit Feedback Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Feedback</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Stack spacing={2}>
              <Box>
                <Typography gutterBottom>Event</Typography>
                <select
                  value={formData.eventId}
                  onChange={(e) => setFormData({ ...formData, eventId: parseInt(e.target.value) })}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  {events.map(e => (
                    <option key={e.id} value={e.id}>{e.title}</option>
                  ))}
                </select>
              </Box>
              <Box>
                <Typography gutterBottom>Rating</Typography>
                <Rating
                  value={formData.rating}
                  onChange={(_, value) => setFormData({ ...formData, rating: value || 5 })}
                  size="large"
                />
              </Box>
              <TextField
                label="Title"
                fullWidth
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
              <TextField
                label="Your Feedback"
                multiline
                rows={4}
                fullWidth
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmitFeedback}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default { FeedbackPage };
