import { AtomSpinner } from 'react-epic-spinners';
import { useEffect, useState } from 'react';
import { Progress } from 'antd';
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// ----------------------------------------------------------------------

export default function LoadingScreen({ }) {
  useEffect(() => {
    NProgress.configure({ showSpinner: false })
    NProgress.start();

    return () => {
      NProgress.done();
    };
  });
  return (
    <>
    </>
  );
}
