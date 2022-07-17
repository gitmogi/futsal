import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import GroundSlide from 'components/organisms/GroundSlide';
import GroundReservationCalendar from 'components/organisms/GroundReservationCalendar';
import GroundTime from 'components/organisms/GroundTime';
import Button from 'components/atoms/Button';
import { Link } from 'react-router-dom';
import * as Api from 'api/api';
import GroundInfo from '../components/organisms/GroundInfo';

const Ground = () => {
  const [detailInfo, setDetailInfo] = useState([]);

  useEffect(() => async () => {
      const result = await Api.get(`grounds/62d2d84af34863cbb7647549`);
      return setDetailInfo(result.data);
    }, []);
  return (
    <>
      <GroundSlide info={detailInfo.groundImg} />
      <Container>
        <GroundInfo info={detailInfo} />
        <GroundReservationCalendar />
        <GroundTime />
        <BackBtn>
          <Link to='/'>돌아가기</Link>{' '}
        </BackBtn>
        <ReservationBtn>예약하기</ReservationBtn>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 80%;
  margin: auto;
`;

const ReservationBtn = styled(Button)`
  font-size: 18px;
  float: right;
  border: solid 1px black;
  margin: 1rem 1.5rem 2rem 0;
`;
const BackBtn = styled(Button)`
  font-size: 18px;
  color: #3563e9;
  background-color: white;
  border: solid 1px black;
  float: right;
  margin: 1rem 1rem 0 0;
`;
export default Ground;
