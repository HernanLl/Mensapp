import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import useList from "Hooks/useList";

import Userbox from "Common/Userbox";
import Icon from "Common/Icon";

function Userslist(props) {
  const { users, onClickUser } = props;
  const [value, setValue] = useState("");
  const [filterusers, setFilterusers] = useState([]);
  const [filterconversations, setFilterconversations] = useState([]);

  useEffect(() => {
    const otherusers = users.filter(
      (elem) =>
        elem.name.toLowerCase().indexOf(value.toLowerCase()) === 0 &&
        !elem.latestmessage
    );
    const conversations = users.filter(
      (elem) =>
        elem.name.toLowerCase().indexOf(value.toLowerCase()) === 0 &&
        elem.latestmessage
    );
    setFilterusers(otherusers);
    setFilterconversations(conversations);
  }, [value, users]);

  return (
    <div className="Userslist">
      <div className="Userslist__input__container">
        <Icon name="SEARCH" size={20} color="#ccc" />
        <input
          className="Userslist__input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar"
        />
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

Userslist.propTypes = {
  users: PropTypes.array,
  onClickUser: PropTypes.func,
};

export default Userslist;
