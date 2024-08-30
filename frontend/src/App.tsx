import React, { useState, useEffect } from 'react';
import { Container, Typography, LinearProgress, Box, TextField, Button, List, ListItem, ListItemText, ListItemIcon, Checkbox, CircularProgress } from '@mui/material';
import Modal from 'react-modal';
import { backend } from 'declarations/backend';

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showReward, setShowReward] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await backend.getTasks();
      setTasks(fetchedTasks);
      const fetchedProgress = await backend.getProgress();
      setProgress(fetchedProgress);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const addTask = async () => {
    if (newTask.trim() !== '') {
      try {
        await backend.addTask(newTask);
        setNewTask('');
        fetchTasks();
      } catch (error) {
        console.error('Error adding task:', error);
      }
    }
  };

  const toggleTask = async (id: number) => {
    try {
      await backend.toggleTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const checkCompletion = () => {
    if (progress === 1) {
      setShowReward(true);
    }
  };

  useEffect(() => {
    checkCompletion();
  }, [progress]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" className="mt-8">
      <Box className="bg-white rounded-lg shadow-md p-6">
        <Box display="flex" alignItems="center" mb={4}>
          <img
            src="https://images.unsplash.com/photo-1653379671027-bd1be50c4ad1?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjQ5ODg2Nzh8&ixlib=rb-4.0.3"
            alt="Profile"
            className="w-16 h-16 rounded-full mr-4"
          />
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Hi, Jack!
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
        </Box>

        <List>
          {tasks.map((task) => (
            <ListItem key={task.id} button onClick={() => toggleTask(task.id)}>
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={task.completed}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText primary={task.text} />
            </ListItem>
          ))}
        </List>

        <Box mt={4}>
          <LinearProgress variant="determinate" value={progress * 100} />
          <Typography variant="body2" color="textSecondary" align="center" mt={1}>
            {Math.round(progress * 100)}% Complete
          </Typography>
        </Box>

        <Box mt={4}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Add a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            onClick={addTask}
            className="mt-2"
          >
            Add Task
          </Button>
        </Box>
      </Box>

      <Modal
        isOpen={showReward}
        onRequestClose={() => setShowReward(false)}
        contentLabel="Reward"
        className="flex items-center justify-center"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div className="bg-white p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Congratulations!</h2>
          <p className="mb-4">You've completed all your tasks!</p>
          <Button variant="contained" color="primary" onClick={() => setShowReward(false)}>
            Claim Reward
          </Button>
        </div>
      </Modal>
    </Container>
  );
};

export default App;
