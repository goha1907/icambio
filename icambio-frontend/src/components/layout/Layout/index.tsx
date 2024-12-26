import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import styled from 'styled-components';

const Main = styled.main`
 min-height: calc(100vh - 120px);
 padding: 20px 0;
`;

const Layout = () => (
 <>
   <Header />
   <Main>
     <Outlet />
   </Main>
   <Footer />
 </>
);

export default Layout;