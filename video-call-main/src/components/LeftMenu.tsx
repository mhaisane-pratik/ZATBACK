import { Drawer, Box, Typography, Divider } from "@mui/material";

type LeftMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function LeftMenu({ open, onClose }: LeftMenuProps) {
  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box sx={{ width: 260, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Menu
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography sx={{ mb: 1 }}>Dashboard</Typography>
        <Typography sx={{ mb: 1 }}>Chat</Typography>
        <Typography sx={{ mb: 1 }}>Calendar</Typography>
        <Typography sx={{ mb: 1 }}>Recordings</Typography>
        <Typography>Settings</Typography>
      </Box>
    </Drawer>
  );
}
