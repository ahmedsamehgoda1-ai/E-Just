package com.ejust.Backend;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class FunctionsTest {

    private static final double DELTA = 1e-9;

    @Test
    void hooksLaw_returnsNegativeConstantTimesDisplacement() {
        assertEquals(-20.0, Functions.HooksLaw(10, 2), DELTA);
    }

    @Test
    void hooksLaw_zeroConstantGivesZeroForce() {
        assertEquals(0.0, Functions.HooksLaw(0, 5), DELTA);
    }

    @Test
    void hooksLaw_negativeDisplacementGivesPositiveForce() {
        assertEquals(15.0, Functions.HooksLaw(5, -3), DELTA);
    }

    @Test
    void hooksLaw_negativeConstantThrows() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> Functions.HooksLaw(-1, 2));
        assertEquals("Spring constant must be >= 0", ex.getMessage());
    }

    @Test
    void projectileX_horizontalShot() {
        assertEquals(50.0, Functions.projectileX(10, 0, 5), DELTA);
    }

    @Test
    void projectileX_verticalShotHasNoHorizontalDistance() {
        assertEquals(0.0, Functions.projectileX(10, 90, 5), 1e-6);
    }

    @Test
    void projectileX_negativeTimeThrows() {
        assertThrows(IllegalArgumentException.class, () -> Functions.projectileX(10, 45, -1));
    }

    @Test
    void projectileY_atTimeZeroIsInitialHeight() {
        assertEquals(7.0, Functions.projectileY(10, 30, 7, 0), DELTA);
    }

    @Test
    void projectileY_fallingFromRest() {
        assertEquals(100 - 0.5 * 9.81 * 4, Functions.projectileY(0, 0, 100, 2), DELTA);
    }

    @Test
    void projectileY_negativeTimeThrows() {
        assertThrows(IllegalArgumentException.class, () -> Functions.projectileY(10, 45, 0, -0.1));
    }

    @Test
    void projectileMaxHeight_straightUp() {
        assertEquals(100.0 / (2 * 9.81), Functions.projectileMaxHeight(10, 90, 0), 1e-9);
    }

    @Test
    void projectileMaxHeight_addsInitialHeight() {
        assertEquals(5.0, Functions.projectileMaxHeight(0, 45, 5), DELTA);
    }

    @Test
    void projectileTotalTime_fromGround() {
        assertEquals(2 * 10 / 9.81, Functions.projectileTotalTime(10, 90, 0), 1e-9);
    }

    @Test
    void projectileTotalTime_negativeDiscriminantReturnsZero() {
        assertEquals(0.0, Functions.projectileTotalTime(0, 0, -5), DELTA);
    }

    @Test
    void stress_isForceDividedByArea() {
        assertEquals(500.0, Functions.stress(1000, 2), DELTA);
    }

    @Test
    void stress_zeroForceGivesZeroStress() {
        assertEquals(0.0, Functions.stress(0, 4), DELTA);
    }

    @Test
    void stress_zeroAreaThrows() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> Functions.stress(100, 0));
        assertEquals("cross sectional area must be bigger than 0", ex.getMessage());
    }

    @Test
    void stress_negativeAreaThrows() {
        assertThrows(IllegalArgumentException.class, () -> Functions.stress(100, -1));
    }

    @Test
    void strain_isChangeDividedByOriginalLength() {
        assertEquals(0.01, Functions.strain(0.02, 2), DELTA);
    }

    @Test
    void strain_compressionIsNegative() {
        assertEquals(-0.5, Functions.strain(-1, 2), DELTA);
    }

    @Test
    void strain_zeroLengthThrows() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> Functions.strain(1, 0));
        assertEquals("original length must be bigger than 0", ex.getMessage());
    }

    @Test
    void strain_negativeLengthThrows() {
        assertThrows(IllegalArgumentException.class, () -> Functions.strain(1, -2));
    }

    @Test
    void ohmsLaw_isVoltageDividedByResistance() {
        assertEquals(2.0, Functions.OhmsLaw(12, 6), DELTA);
    }

    @Test
    void ohmsLaw_zeroResistanceThrows() {
        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> Functions.OhmsLaw(12, 0));
        assertEquals("Resistance must be > 0", ex.getMessage());
    }

    @Test
    void ohmsLaw_negativeResistanceThrows() {
        assertThrows(IllegalArgumentException.class, () -> Functions.OhmsLaw(12, -3));
    }

    @Test
    void functions_classCanBeCreated() {
        assertNotNull(new Functions());
    }
}