import logo from '../assets/img/logo-admin.png'
import logoCollapse from '../assets/img/logo-collapse.png'
import { Link } from 'react-router-dom'

export const Logo = () => {

  return (
    <img src={logo} style={{ width: "85px", /* marginTop: "25px", */ marginLeft: "35px" }} />
  )

}

export const LogoMobile = () => {

  return (
    <Link to='/' style={{ display: 'flex', justifyContent: 'center', paddingBottom: 10 }}>
      <img src={logo} style={{ width: "135px" }} />
    </Link>
  )

}

export const LogoCollapse = () => {

  return (
    // <Link to='/'>
    <img src={logoCollapse} style={{ width: "40px"/* , marginTop: "25px"  */ }} />
    // </Link>
  )

}
