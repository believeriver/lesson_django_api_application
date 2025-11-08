import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid, Paper } from '@mui/material';

const apps = [
  { path: '/', label: 'ホーム' },
  { path: '/insta_clone', label: 'SNS clone' },
  { path: '/household', label: '家計簿アプリ' },
  // { path: "/user", label: "ユーザー管理" },
  // { path: "/profile", label: "プロフィール編集" },
  // { path: "/settings", label: "設定" },
  // { path: "/contact", label: "お問い合わせ" },
];

const Menu: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Menu
      </Typography>
      <br />
      <Grid container spacing={3}>
        {apps.map((app) => (
          <Grid size={{ xs: 12, md: 4 }} key={app.path}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: 'primary.light',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'primary.main', color: '#fff' },
                userSelect: 'none',
              }}
              component={Link}
              to={app.path}
            >
              <Typography variant="h6">{app.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Menu;
