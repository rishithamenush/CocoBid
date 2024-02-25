import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import React from "react";
import { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";

const NavLoggedOut = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState("");

  const handleSearch = () => {
    navigate(`/searchResults?name=${value}`);
  };
  return (
    <div className={styles.home_container}>
      <nav className={styles.navbar}>
        <a href="/login">
          <button className={styles.white_btn}>LOGIN</button>
        </a>

        <form action="" className={styles.search_bar}>
          <input
            type="text"
            placeholder="Search"
            name="name"
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <button type="submit" onClick={handleSearch}>
            <BiSearchAlt> </BiSearchAlt>
          </button>
        </form>
        <h1>
          <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <img
              src="./website_icon.png"
              width={"250px"}
              height={"250px"}
              alt={"website icon"}
              style={{ marginTop: "65px" }}
            />
          </a>
        </h1>
      </nav>
    </div>
  );
};

export default NavLoggedOut;
