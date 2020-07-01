import React, { useState } from "react";
import PropTypes from "prop-types";
import "./styles.scss";
import Userbox from "Common/Userbox/Userbox";
import Icon from "Common/Icon/Icon";
import { useMemo } from "react";

function Userslist(props) {
  const { users, onClickUser } = props;
  const [value, setValue] = useState("");
  const [filterusers, setFilterusers] = useState([]);
  const [filterconversations, setFilterconversations] = useState([]);

  useMemo(() => {
    const otherusers = users.filter(
      (elem) =>
        elem.name.toLowerCase().indexOf(value.toLowerCase()) === 0 &&
        !elem.latestmessage
    );
    setFilterusers(otherusers);
  }, [value, users]);
  useMemo(() => {
    const conversations = users.filter(
      (elem) =>
        elem.name.toLowerCase().indexOf(value.toLowerCase()) === 0 &&
        elem.latestmessage
    );
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
      {filterconversations.map((user) => (
        <Userbox key={user.id} {...user} onClick={onClickUser} />
      ))}
      {filterusers.length > 0 && (
        <p className="Userslist__reference">Usuarios</p>
      )}
      {filterusers.map((user) => (
        <Userbox key={user.id} {...user} onClick={onClickUser} />
      ))}
    </div>
  );
}

Userslist.propTypes = {
  users: PropTypes.array,
  onClickUser: PropTypes.func,
};

export default Userslist;
