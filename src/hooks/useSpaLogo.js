import React from 'react';
import { Button } from 'antd';
import { resetRoute } from '../utils/utils';
import logo from '../asstes/logo.png';

const useSpaLogo = () => {
  return [
    <Button type="link" style={{ padding: 0 }} onClick={resetRoute}>
      <img alt="logo" src={logo} style={{ width: 100, verticalAlign: 'top', marginTop: -3 }} />
    </Button>
  ];
}
export default useSpaLogo;