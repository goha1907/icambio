import styled from 'styled-components';

export const Button = styled.button`
 background: #2EA846;
 color: white;
 border: none;
 padding: 10px 20px;
 border-radius: 4px;
 cursor: pointer;
 
 &:hover {
   background: #248636;
 }
 
 &:disabled {
   background: #ccc;
   cursor: not-allowed;
 }
`;