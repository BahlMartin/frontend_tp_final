import React from 'react'
import './TwoFAStep.css'

export const TwoFAStep = ({ form, email, loading, error, goBackToEmail }) => {
    return (
        <>
            <h2 className="login-screen__heading">Introduce el código</h2>
            <p className="login-screen__subheading">Hemos enviado un código temporal de 6 dígitos a <strong>{email}</strong>.</p>

            <form className="login-screen__form" onSubmit={form.handleSubmit}>
                <div className="login-screen__input-group">
                    <label className="login-screen__label" htmlFor="code">Código de acceso</label>
                    <input
                        className="login-screen__input login-screen__input--code"
                        type="text"
                        id="code"
                        name="code"
                        placeholder="123456"
                        maxLength={6}
                        autoComplete="one-time-code"
                        value={form.formState.code}
                        onChange={form.handleChange}
                        required
                        autoFocus
                    />
                </div>

                <button className="login-screen__submit-btn" type="submit" disabled={loading}>
                    {loading ? 'Verificando...' : 'Verificar código'}
                </button>

                {error && <div className="login-screen__error-msg">{error.message}</div>}

                <button className="login-screen__cancel-btn" type="button" onClick={goBackToEmail}>
                    Volver a intentar
                </button>
            </form>
        </>
    )
}

export default TwoFAStep
