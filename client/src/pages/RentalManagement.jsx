import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { userPointState, userState } from 'stores/userStore';
import styled from 'styled-components';
import { IoIosArrowDown } from '@react-icons/all-files/io/IoIosArrowDown';
import { IoIosArrowUp } from '@react-icons/all-files/io/IoIosArrowUp';
import * as Api from '../api/api';
import MyinfoPagination from '../components/organisms/MyinfoPagination';

const RentalManagement = () => {
  const [rental, setRental] = useState([]);
  const setTotalPoint = useSetRecoilState(userPointState);
  const setUser = useSetRecoilState(userState);
  const [page, setPage] = useState(1);
  const [openTimes, setOpenTimes] = useState(null);
  const listPerPage = 6;
  const totalPage = Math.ceil(rental.length / listPerPage);
  const offset = (page - 1) * listPerPage;

  const time = new Date();

  const rentalInformation = async () => {
    try {
      const result = await Api.get('rentals/user');
      setRental(result.data.sort(() => -1));
    } catch (err) {
      console.log(err);
    }
  };

  const userInformation = async () => {
    try {
      const result = await Api.get('users/user');
      setUser((prev) => ({ ...prev, ...result.data }));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    rentalInformation();
    userInformation();
  }, []);

  const handleClick = async (rentalId) => {
    if (window.confirm('예약을 정말 취소하시겠습니까?')) {
      try {
        const result = await Api.delete(`rentals/${rentalId}`);
        if (result.status === 204) {
          alert('예약이 취소 되었습니다.');
          rentalInformation();
          setTotalPoint((prev) => ({ ...prev, isChange: true }));
        } else {
          alert('예약을 취소하지 못 했습니다.');
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getRentalTime = (info) => {
    const arr = [];
    const newarr = [];
    const result = [];

    for (let i = 0; i < info.length; i += 1) {
      arr.push(info[i].slice(0, 2));
      arr.push(info[i].slice(6, 8));
    }

    arr.sort();

    for (let i = 0; i < arr.length; i += 1) {
      if (i === 0) {
        newarr.push(arr[i]);
      } else if (newarr[newarr.length - 1] !== arr[i]) {
        newarr.push(arr[i]);
      } else if (newarr[newarr.length - 1] === arr[i]) {
        newarr.pop();
      }
    }

    for (let i = 0; i < newarr.length; i += 2) {
      result.push(`${newarr[i]}:00~${newarr[i + 1]}:00`);
    }

    return result;
  };

  return (
    <Container>
      <Title>예약 조회</Title>
      <Wrapper>
        <Contents>
          {rental.slice(offset, offset + listPerPage).map((item) => (
            <Content key={item._id}>
              <RentalDate>
                {`${time.getFullYear()}-${item.reservationDate.slice(
                  0,
                  2,
                )}-${item.reservationDate.slice(2, 4)}`}
              </RentalDate>
              <RentalInfo>
                <GroundName>
                  <NavLink to={`/grounds/${item.groundId._id}`}>
                    {item.groundName}
                  </NavLink>
                </GroundName>
                <Time>
                  <div
                    id={item._id}
                    open={openTimes}
                    style={{ alignItems: 'center' }}
                  >
                    {getRentalTime(item.reservationTime)[0]}
                    {getRentalTime(item.reservationTime)[1] && (
                      <>
                        <OpenIcon
                          id={item._id}
                          open={openTimes}
                          onClick={() => {
                            setOpenTimes(item._id);
                          }}
                        />
                        <CloseIcon
                          id={item._id}
                          open={openTimes}
                          onClick={() => {
                            if (openTimes) {
                              setOpenTimes(null);
                            }
                          }}
                        />
                      </>
                    )}
                  </div>
                  <TextListOpen
                    id={item._id}
                    open={openTimes}
                    style={{
                      display: `${item._id === openTimes ? 'flex' : 'none'}`,
                      alignItems: 'flex-start',
                    }}
                  >
                    {getRentalTime(item.reservationTime).join(' ')}
                  </TextListOpen>
                </Time>
                {`${time.getFullYear()}${item.reservationDate.slice(
                  0,
                  2,
                )}${item.reservationDate.slice(
                  2,
                  4,
                )}${item.reservationTime[0].slice(0, 2)}` <=
                `${time.getFullYear()}${
                  `${time.getMonth() + 1}`.length === 1
                    ? `0${time.getMonth() + 1}`
                    : `${time.getMonth() + 1}`
                }${time.getDate() + 1}${
                  `${time.getHours()}`.length === 1
                    ? `0${time.getHours()}`
                    : `${time.getHours()}`
                }` ? (
                  <div style={{ width: '8.640625rem', height: '2.225rem' }} />
                ) : (
                  <div>
                    <Button>
                      <NavLink
                        to={`/myinfo/rental/${item.groundId._id}/${item._id}`}
                      >
                        변경
                      </NavLink>
                    </Button>
                    <Button onClick={() => handleClick(item._id)}>취소</Button>
                  </div>
                )}
              </RentalInfo>
            </Content>
          ))}
        </Contents>
      </Wrapper>
      <MyinfoPagination
        totalPage={totalPage}
        limit={5}
        page={page}
        setPage={setPage}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start;
  line-height: 3rem;
  padding: 1.875rem 3.125rem 0;
  margin-top: 1.875rem;
  color: #000000;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 700;
  font-size: 2rem;
  letter-spacing: -0.0625rem;
`;

const Wrapper = styled.div`
  height: 100%;
  margin: 0.9375rem 3rem;
`;

const Contents = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-size: 1.5rem;
  line-height: 1.8125rem;
`;

const RentalInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.75rem;

  & div {
    display: flex;
  }
`;

const RentalDate = styled.div`
  margin-bottom: 0.75rem;
`;

const GroundName = styled.div`
  width: 21.875rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Time = styled.div`
  display: flex;
  width: 8.375rem;
  margin: auto;
`;

const Button = styled.button`
  display: flex;
  margin-left: 1.25rem;
  padding: 0.3125rem 0.5rem;
  border-radius: 0.25rem;
  color: white;
  background: #3563e9;
  font-size: 1.125rem;

  &:hover {
    opacity: 0.7;
  }
`;

const TextListOpen = styled.div`
  width: 8.375rem;
  height: auto;
  position: absolute;
  background-color: #fff;
  white-space: wrap;
  user-select: none;
  outline: solid 0.125rem #3563e9;
  border-radius: 0.3125rem;
`;

const OpenIcon = styled(IoIosArrowDown)`
  display: ${(props) => (props.id === props.open ? 'none' : 'flex')};
  font-size: 1.25rem;
  margin-top: 0.1875rem;
  cursor: pointer;
`;
const CloseIcon = styled(IoIosArrowUp)`
  display: ${(props) => (props.id === props.open ? 'flex' : 'none')};
  font-size: 1.25rem;
  margin-top: 0.1875rem;
  cursor: pointer;
`;

export default RentalManagement;
