import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import useList from "../../../Hooks/useList";
import Userbox from "../../Common/Userbox/Userbox";
import Icon from "../../Common/Icon/Icon";

function Userslist(props) {
  const { users, onClickUser } = props;
  const [value, setValue] = useState("");
  const [filterusers, setFilterusers] = useState([]);
  const [filterconversations, setFilterconversations] = useState([]);

  const onChange = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    const arr1 = users.filter(
      (elem) =>
        elem.name.toLowerCase().indexOf(value.toLowerCase()) === 0 &&
        !elem.latestmessage
    );
    const arr2 = users.filter(
      (elem) =>
        elem.name.toLowerCase().indexOf(value.toLowerCase()) === 0 &&
        elem.latestmessage
    );
    setFilterusers(arr1);
    setFilterconversations(arr2);
  }, [value, users]);
  return (
    <div className="Userslist">
      <div className="Userslist__input">
        <Icon name="SEARCH" size={20} color="#ccc" />
        <input value={value} onChange={onChange} placeholder="Buscar" />
      </div>
      {filterconversations.length > 0 && (
        <p className="Userslist__reference">Conversaciones recientes</p>
      )}
      {useList(filterconversations, Userbox, onClickUser)}
      {filterusers.length > 0 && (
        <p className="Userslist__reference">Usuarios</p>
      )}
      {useList(filterusers, Userbox, onClickUser)}
    </div>
  );
}

Userslist.propTypes = {};

export default Userslist;
