import { createStyles, Theme } from '@material-ui/core';

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      width: 800,
      padding: 40,
    },
  });
