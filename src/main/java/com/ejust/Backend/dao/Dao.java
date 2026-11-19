package com.ejust.Backend.dao;

import java.util.List;

/** Operations every DAO must offer, for any entity type T. */
public interface Dao<T> {

	List<T> findAll();
}
