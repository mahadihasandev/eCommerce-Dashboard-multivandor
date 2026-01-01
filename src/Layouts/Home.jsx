
import { Col, Row } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import DashboardMenu from '../Components/DashboardMenu';
import { useSelector } from 'react-redux';



function Home() {
    const userData=useSelector((state)=>(state.activeUser.value))
  let navigate=useNavigate()
 
 if(!userData){
    navigate('/login')
    
  }

  return (
    <div className='w-[1504px] mx-auto border-2 border-blue-300 h-screen'>
     <div className="min-h-screen w-full bg-white relative">
 
  <div
    className="absolute inset-0"
    style={{
      backgroundImage: `
        linear-gradient(45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, #e5e7eb 49%, #e5e7eb 51%, transparent 51%)
      `,
      backgroundSize: "40px 40px",
         WebkitMaskImage:
            "radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 100% 100%, #000 50%, transparent 90%)",
    }}
  />
  {/* Your Content/Components */}

      <Row >
      <Col span={6}>
      <DashboardMenu />
      </Col>
      <Col span={18}>
      <Outlet/>
      </Col>
    </Row>
     
   </div>
    </div>
  )
}

export default Home