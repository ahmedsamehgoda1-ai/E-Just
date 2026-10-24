package com.ejust.Backend;

public class Functions {

    // ==================== Sameh ====================


    public static double HooksLaw(double Constant, double Displacement) {
        if (Constant < 0) {
            throw new IllegalArgumentException("Spring constant must be >= 0");
        }
        return -1*Displacement*Constant;
    }



    // ==================== Omar ====================



    // ==================== Ali ====================



    // ==================== Ayaka ====================

    public static double OhmsLaw(double Voltage, double Resistance) {
        if (Resistance <= 0) {
            throw new IllegalArgumentException("Resistance must be > 0");
        }
        return Voltage / Resistance;
    }



}