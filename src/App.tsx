import {
  CircularProgress,
  CssBaseline,
  Typography,
  withStyles,
  WithStyles,
  Paper,
} from '@material-ui/core';
import React, { Component } from 'react';
import { styles } from './App.styles';

const PUBLIC_NAME = 'Zerong Tony Wang';
const CITY_NAME = 'Brisbane City';
const PAGE_SIZE = 50;

function getUrl(page: number) {
  return `https://cors-anywhere.herokuapp.com/https://www.couchsurfing.com/api/web/users/search?search_query=${encodeURI(
    CITY_NAME,
  )}&page=${page}&perPage=${PAGE_SIZE}`;
}

type Props = WithStyles<typeof styles>;

interface State {
  loading: boolean;
  ranking: null | number;
  error: string;
}

class App extends Component<Props, State> {
  state = {
    loading: false,
    ranking: null,
    error: '',
  };

  componentDidMount() {
    this.checkRank();
  }

  async checkRank() {
    let page = 1;
    let found = false;
    let forceStop = false;
    this.setState({
      loading: true,
    });
    do {
      try {
        found = await this.checkPage(page);
      } catch {
        this.setState({
          error: 'Request to CS failed',
        });
        forceStop = true;
      }
      if (!found) {
        page += 1;
      }
    } while (!found && !forceStop);
    this.setState({ loading: false });
  }

  async checkPage(page: number) {
    const response = await fetch(getUrl(page), {
      headers: {
        Origin: 'whatever',
      },
    });
    if (response.ok) {
      const data = await response.json();
      interface User {
        publicName: string;
      }
      const index = data.results.findIndex(
        (user: User) => user.publicName === PUBLIC_NAME,
      );
      if (index >= 0) {
        this.setState({
          ranking: (page - 1) * PAGE_SIZE + index + 1,
        });
        return true;
      }
    }
    return false;
  }

  render() {
    const { classes } = this.props;
    const { loading, ranking, error } = this.state;

    return (
      <>
        <CssBaseline />
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <Typography>
              {PUBLIC_NAME} in {CITY_NAME}
            </Typography>

            {loading ? (
              <CircularProgress />
            ) : (
              <Typography>{error || `Your ranking is ${ranking}`}</Typography>
            )}
          </Paper>
        </div>
      </>
    );
  }
}
export default withStyles(styles)(App);
