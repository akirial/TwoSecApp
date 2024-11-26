import { Link } from "expo-router";

export default function Layout() {
  return (
    <>
      <Link to="/home">Home</Link>
      <Link to="/login">Login</Link>
    </>
  );
}
