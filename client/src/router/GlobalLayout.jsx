import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from 'components/organisms/Header';
import Footer from 'components/organisms/Footer';

const GlobalLayout = () => (
  <Container>
    <Header />
    <Wrapper>
      <Outlet />
    </Wrapper>
    <Footer />
  </Container>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  height: auto;
  min-height: calc(100vh - 230px);
`;

export default GlobalLayout;
