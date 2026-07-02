import React from 'react'
import EyeIcon from '../EyeIcon/EyeIcon.jsx'
import './ResetPasswordForm.css'

export const ResetPasswordForm = ({
    resetForm,
    showPassword,
    showConfirmPassword,
    toggleShowPassword,
    toggleShowConfirmPassword,
    passwordMatchError,
    resetError,
    resetLoading
}) => (
    <div className="reset-password-form">
        <h2 className="reset-password-form__heading">Configura tu nueva contraseña</h2>
        <p className="reset-password-form__subheading">Escribe una contraseña segura que recuerdes con facilidad.</p>

        <form className="reset-password-form__form" onSubmit={resetForm.handleSubmit}>
            <div className="reset-password-form__input-group">
                <label className="reset-password-form__label" htmlFor="password">Nueva contraseña</label>
                <div className="reset-password-form__password-wrapper">
                    <input
                        className="reset-password-form__input reset-password-form__input--password"
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Mínimo 8 caracteres"
                        value={resetForm.formState.password}
                        onChange={resetForm.handleChange}
                        required
                    />
                    <button
                        type="button"
                        className="reset-password-form__password-toggle"
                        onClick={toggleShowPassword}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        <EyeIcon showCrossed={showPassword} className="reset-password-form__eye-icon" />
                    </button>
                </div>
            </div>

            <div className="reset-password-form__input-group">
                <label className="reset-password-form__label" htmlFor="confirmPassword">Confirmar nueva contraseña</label>
                <div className="reset-password-form__password-wrapper">
                    <input
                        className="reset-password-form__input reset-password-form__input--password"
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Repite tu nueva contraseña"
                        value={resetForm.formState.confirmPassword}
                        onChange={resetForm.handleChange}
                        required
                    />
                    <button
                        type="button"
                        className="reset-password-form__password-toggle"
                        onClick={toggleShowConfirmPassword}
                        aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        <EyeIcon showCrossed={showConfirmPassword} className="reset-password-form__eye-icon" />
                    </button>
                </div>
            </div>

            {(passwordMatchError || resetError) && (
                <div className="reset-password-form__error-msg">
                    {passwordMatchError || resetError.message}
                </div>
            )}

            <button
                className="reset-password-form__submit-btn"
                type="submit"
                disabled={resetLoading}
            >
                {resetLoading ? 'Restableciendo...' : 'Restablecer contraseña'}
            </button>
        </form>
    </div>
)

export default ResetPasswordForm

