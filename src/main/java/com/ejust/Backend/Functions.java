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

    private static final double GRAVITY = 9.81;

    public static double projectileX(double initialVelocity, double angleDegrees, double time) {
        if (time < 0) {
            throw new IllegalArgumentException("Time must be >= 0");
        }
        double rad = Math.toRadians(angleDegrees);
        return initialVelocity * Math.cos(rad) * time;
    }

    public static double projectileY(double initialVelocity, double angleDegrees, double initialHeight, double time) {
        if (time < 0) {
            throw new IllegalArgumentException("Time must be >= 0");
        }
        double rad = Math.toRadians(angleDegrees);
        return initialHeight + (initialVelocity * Math.sin(rad) * time) - (0.5 * GRAVITY * time * time);
    }

    public static double projectileMaxHeight(double initialVelocity, double angleDegrees, double initialHeight) {
        double rad = Math.toRadians(angleDegrees);
        double v0y = initialVelocity * Math.sin(rad);
        return initialHeight + (v0y * v0y) / (2 * GRAVITY);
    }

    public static double projectileTotalTime(double initialVelocity, double angleDegrees, double initialHeight) {
        double rad = Math.toRadians(angleDegrees);
        double v0y = initialVelocity * Math.sin(rad);
        double discriminant = (v0y * v0y) + (2 * GRAVITY * initialHeight);
        if (discriminant < 0) {
            return 0.0;
        }
        return (v0y + Math.sqrt(discriminant)) / GRAVITY;
    }

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