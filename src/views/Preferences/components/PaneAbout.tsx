// import { useDispatch } from 'react-redux'

// import icon from '../../../../shared/static/icon/icon.png';
import Button from '@components/Button';
// import { useSelector } from '../../../shared/state/hooks'
// import {
//   clickedHomepageButton,
//   clickedOpenIssueButton,
// } from '../../state/actions';
import { Pane } from './Pane';

const useDispatch = () => (any: any) => console.log('dispatch: ', any);

export const AboutPane = (): JSX.Element => {
  const dispatch = useDispatch();
  // const version = useSelector((state) => state.data.version);
  const version = '1.0.0';

  return (
    <Pane className="space-y-8" pane="about">
      <div className="text-center">
        {/* <img alt="Logo" className="inline-block w-40" src={icon} /> */}
        <h1 className="mb-2 text-4xl tracking-wider text-gray-900 dark:text-gray-50">
          Browsernaut
        </h1>
        <p className="mb-8 text-xl">Another browser prompter for macOS</p>
        <p className="mb-4 opacity-70">Version {version}</p>
        <p className="mb-8">Copyright © Will Stone</p>
        <div className="space-x-4">
          <Button onClick={() => dispatch('clickedHomepageButton()')}>
            Homepage
          </Button>
          <Button onClick={() => dispatch('clickedOpenIssueButton()')}>
            Report an Issue
          </Button>
        </div>
      </div>
    </Pane>
  );
};
