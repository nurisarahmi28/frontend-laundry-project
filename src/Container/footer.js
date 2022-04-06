import React from "react";
import './footer.css'
import {
  MDBFooter,
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBIcon
} from 'mdb-react-ui-kit';

function Footer() {
  return (
    <div class="">
    <MDBFooter className=' text-center text-white sticky-md-bottom'>
      <MDBContainer className='btncontainer p-4 pb-0'>
        <section className='mb-4 pb-0'>
          <a
            className='btn btn-outline btn-floating m-1'
            style={{ backgroundColor: '#0067F8' }}
            href='#!'
            role='button'
          >
            <MDBIcon fab icon='facebook-f' />
          </a>

          <a
            className='btn btn-outline btn-floating m-1'
            style={{ backgroundColor: '#55acee' }}
            href='#!'
            role='button'
          >
            <MDBIcon fab icon='twitter' />
          </a>

          <a
            className='btn btn-outline btn-floating m-1'
            style={{ backgroundColor: '#dd4b39' }}
            href='#!'
            role='button'
          >
            <MDBIcon fab icon='google' />
          </a>
          <a
            className='btn btn-outline btn-floating m-1'
            style={{ backgroundColor: '#ff7aad' }}
            href='https://www.instagram.com/nrisaarh/'
            role='button'
          >
            <MDBIcon fab icon='instagram' />
          </a>

          <a
            className='btn btn-outline btn-floating m-1'
            style={{ backgroundColor: '#0082ca' }}
            href='https://www.linkedin.com/in/nurisa-rahmi-audining-putri-40ab19224/'
            role='button'
          >
            <MDBIcon fab icon='linkedin-in' />
          </a>

          <a
            className='btn btn-outline btn-floating m-1'
            style={{ backgroundColor: '#769463' }}
            href='https://github.com/nurisarahmi28'
            role='button'
          >
            <MDBIcon fab icon='github' />
          </a>
        </section>
      </MDBContainer>

      <div className='text-center text-dark p-3' style={{ backgroundColor: '#FBE7C6' }}>
        © Made with love 
        <a className='text-dark' href='https://www.google.com/imgres?imgurl=https%3A%2F%2Fimg.wattpad.com%2F07265b6d42f17e17f7cb069831cacd4bcb7e8e6b%2F68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f6b334f4f5053644242305f4f67773d3d2d3734373035373733332e3135613938396433393833383333633137333334393233303132372e6a7067%3Fs%3Dfit%26w%3D720%26h%3D720&imgrefurl=https%3A%2F%2Fwww.wattpad.com%2F747057733-anime-lovers-zone-review-gakuen-babysitters&tbnid=wCvyrIlbKz6R4M&vet=12ahUKEwiShLfSts72AhXuQmwGHXL6CqsQMygEegUIARC8AQ..i&docid=QW8j5X-55G_4XM&w=700&h=700&q=kotaro%20anime&ved=2ahUKEwiShLfSts72AhXuQmwGHXL6CqsQMygEegUIARC8AQ'>
            , kotaro
        </a>
      </div>
    </MDBFooter>
    </div>
  );
}
export default Footer;