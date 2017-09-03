import dva from 'dva';
import { browserHistory } from 'dva/router';
import createLoading from 'dva-loading';
import './index.css';
import './index.html';

const app = dva({
  history: browserHistory,
});

app.use(createLoading({ effects: true }));

app.model(require('./models/app'));
app.model(require('./models/user'));
app.model(require('./models/org'));

app.router(require('./router'));

app.start('#root');

window.app = app;
