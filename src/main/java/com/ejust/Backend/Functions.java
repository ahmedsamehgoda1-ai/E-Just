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
    public static double stress(double force, double area) {
        if (area <= 0) {
            throw new IllegalArgumentException("cross sectional area must be bigger than 0");
        }
        return force / area;
    }

    public static double strain(double changeInLength, double originalLength) {
        if (originalLength <= 0) {
            throw new IllegalArgumentException("original length must be bigger than 0");
        }
        return changeInLength / originalLength;
    }


    // ==================== Ayaka ====================

    public static double OhmsLaw(double Voltage, double Resistance) {
        if (Resistance <= 0) {
            throw new IllegalArgumentException("Resistance must be > 0");
        }
        return Voltage / Resistance;
    }



}