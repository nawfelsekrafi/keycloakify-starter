import { useState, useEffect, useReducer } from "react";
import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { assert } from "keycloakify/tools/assert";
import { clsx } from "keycloakify/tools/clsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import { getKcClsx, type KcClsx } from "keycloakify/login/lib/kcClsx";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;

    const { kcClsx } = getKcClsx({
        doUseDefaultCss,
        classes
    });

    const { social, realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [isLoginButtonDisabled, setIsLoginButtonDisabled] = useState(false);

    return (
        <Template
            kcContext={kcContext}
            i18n={i18n}
            doUseDefaultCss={doUseDefaultCss}
            classes={classes}
            displayMessage={!messagesPerField.existsError("username", "password")}
            headerNode={msg("loginAccountTitle")}
            displayInfo={realm.password && realm.registrationAllowed && !registrationDisabled}
            infoNode={
                <div id="kc-registration-container">
                    <div id="kc-registration">
                        <span>
                            {msg("noAccount")}{" "}
                            <a tabIndex={8} href={url.registrationUrl}>
                                {msg("doRegister")}
                            </a>
                        </span>
                    </div>
                </div>
            }
            socialProvidersNode={
                <>
                    {realm.password && social?.providers !== undefined && social.providers.length !== 0 && (
                        <div id="kc-social-providers" className={kcClsx("kcFormSocialAccountSectionClass")}>
                            <hr />
                            <h2>{msg("identity-provider-login-label")}</h2>
                            <ul className={kcClsx("kcFormSocialAccountListClass", social.providers.length > 3 && "kcFormSocialAccountListGridClass")}>
                                {social.providers.map((...[p, , providers]) => (
                                    <li key={p.alias}>
                                        <a
                                            id={`social-${p.alias}`}
                                            className={kcClsx(
                                                "kcFormSocialAccountListButtonClass",
                                                providers.length > 3 && "kcFormSocialAccountGridItem"
                                            )}
                                            type="button"
                                            href={p.loginUrl}
                                        >
                                            {p.iconClasses && <i className={clsx(kcClsx("kcCommonLogoIdP"), p.iconClasses)} aria-hidden="true"></i>}
                                            <span
                                                className={clsx(kcClsx("kcFormSocialAccountNameClass"), p.iconClasses && "kc-social-icon-text")}
                                                dangerouslySetInnerHTML={{ __html: kcSanitize(p.displayName) }}
                                            ></span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </>
            }
        >
            <div id="kc-form">
                <div id="kc-form-wrapper">
                    {realm.password && (
                        <form
                            id="kc-form-login"
                            onSubmit={() => {
                                setIsLoginButtonDisabled(true);
                                return true;
                            }}
                            action={url.loginAction}
                            method="post"
                        >
                            {!usernameHidden && (
                                <div className={kcClsx("kcFormGroupClass")}>
                                    <label htmlFor="username" className={kcClsx("kcLabelClass")}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path
                                                d="M1.66699 10.0026C1.66699 6.85991 1.66699 5.28856 2.6433 4.31225C3.61961 3.33594 5.19096 3.33594 8.33366 3.33594H11.667C14.8097 3.33594 16.381 3.33594 17.3573 4.31225C18.3337 5.28856 18.3337 6.85991 18.3337 10.0026C18.3337 13.1453 18.3337 14.7166 17.3573 15.693C16.381 16.6693 14.8097 16.6693 11.667 16.6693H8.33366C5.19096 16.6693 3.61961 16.6693 2.6433 15.693C1.66699 14.7166 1.66699 13.1453 1.66699 10.0026Z"
                                                stroke="#A1A5CF"
                                                stroke-width="1.25"
                                            />
                                            <path
                                                d="M5 6.66406L6.79908 8.1633C8.32961 9.43874 9.09488 10.0765 10 10.0765C10.9051 10.0765 11.6704 9.43874 13.2009 8.16329L15 6.66406"
                                                stroke="#A1A5CF"
                                                strokeWidth="1.25"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        {!realm.loginWithEmailAllowed
                                            ? msg("username")
                                            : !realm.registrationEmailAsUsername
                                              ? msg("usernameOrEmail")
                                              : msg("email")}
                                    </label>
                                    <input
                                        tabIndex={2}
                                        id="username"
                                        className={kcClsx("kcInputClass")}
                                        name="username"
                                        defaultValue={login.username ?? ""}
                                        type="text"
                                        autoFocus
                                        autoComplete="username"
                                        aria-invalid={messagesPerField.existsError("username", "password")}
                                    />
                                    {messagesPerField.existsError("username", "password") && (
                                        <span
                                            id="input-error"
                                            className={kcClsx("kcInputErrorMessageClass")}
                                            aria-live="polite"
                                            dangerouslySetInnerHTML={{
                                                __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                            }}
                                        />
                                    )}
                                </div>
                            )}

                            <div className={kcClsx("kcFormGroupClass")}>
                                <label htmlFor="password" className={kcClsx("kcLabelClass")}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path
                                            d="M14.25 6.318V5.25C14.25 3.85761 13.6969 2.52226 12.7123 1.53769C11.7277 0.553124 10.3924 0 9 0C7.60761 0 6.27226 0.553124 5.28769 1.53769C4.30312 2.52226 3.75 3.85761 3.75 5.25V6.318C3.08202 6.60953 2.51347 7.08939 2.11387 7.69891C1.71428 8.30842 1.50096 9.02118 1.5 9.75V14.25C1.50119 15.2442 1.89666 16.1973 2.59966 16.9003C3.30267 17.6033 4.2558 17.9988 5.25 18H12.75C13.7442 17.9988 14.6973 17.6033 15.4003 16.9003C16.1033 16.1973 16.4988 15.2442 16.5 14.25V9.75C16.499 9.02118 16.2857 8.30842 15.8861 7.69891C15.4865 7.08939 14.918 6.60953 14.25 6.318ZM5.25 5.25C5.25 4.25544 5.64509 3.30161 6.34835 2.59835C7.05161 1.89509 8.00544 1.5 9 1.5C9.99456 1.5 10.9484 1.89509 11.6517 2.59835C12.3549 3.30161 12.75 4.25544 12.75 5.25V6H5.25V5.25ZM15 14.25C15 14.8467 14.7629 15.419 14.341 15.841C13.919 16.2629 13.3467 16.5 12.75 16.5H5.25C4.65326 16.5 4.08097 16.2629 3.65901 15.841C3.23705 15.419 3 14.8467 3 14.25V9.75C3 9.15326 3.23705 8.58097 3.65901 8.15901C4.08097 7.73705 4.65326 7.5 5.25 7.5H12.75C13.3467 7.5 13.919 7.73705 14.341 8.15901C14.7629 8.58097 15 9.15326 15 9.75V14.25Z"
                                            fill="#A1A5CF"
                                        />
                                        <path
                                            d="M9 10.5C8.80109 10.5 8.61032 10.579 8.46967 10.7197C8.32902 10.8603 8.25 11.0511 8.25 11.25V12.75C8.25 12.9489 8.32902 13.1397 8.46967 13.2803C8.61032 13.421 8.80109 13.5 9 13.5C9.19892 13.5 9.38968 13.421 9.53034 13.2803C9.67099 13.1397 9.75001 12.9489 9.75001 12.75V11.25C9.75001 11.0511 9.67099 10.8603 9.53034 10.7197C9.38968 10.579 9.19892 10.5 9 10.5Z"
                                            fill="#A1A5CF"
                                        />
                                    </svg>
                                    {msg("password")}
                                </label>
                                <PasswordWrapper kcClsx={kcClsx} i18n={i18n} passwordInputId="password">
                                    <input
                                        tabIndex={3}
                                        id="password"
                                        className={kcClsx("kcInputClass")}
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        aria-invalid={messagesPerField.existsError("username", "password")}
                                    />
                                </PasswordWrapper>
                                {usernameHidden && messagesPerField.existsError("username", "password") && (
                                    <span
                                        id="input-error"
                                        className={kcClsx("kcInputErrorMessageClass")}
                                        aria-live="polite"
                                        dangerouslySetInnerHTML={{
                                            __html: kcSanitize(messagesPerField.getFirstError("username", "password"))
                                        }}
                                    />
                                )}
                            </div>
                            <div className={kcClsx("kcFormGroupClass", "kcFormSettingClass")}>
                                <div id="kc-form-options">
                                    {realm.rememberMe && !usernameHidden && (
                                        <div className="switch-container">
                                            <label className="switch">
                                                <input
                                                    tabIndex={5}
                                                    id="rememberMe"
                                                    name="rememberMe"
                                                    type="checkbox"
                                                    defaultChecked={!!login.rememberMe}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                            <label className="switch-label" htmlFor="rememberMe">
                                                {msg("rememberMe")}
                                            </label>
                                        </div>
                                    )}
                                </div>
                                <div className={kcClsx("kcFormOptionsWrapperClass")}>
                                    {realm.resetPasswordAllowed && (
                                        <span>
                                            <a tabIndex={6} href={url.loginResetCredentialsUrl}>
                                                {msg("doForgotPassword")}
                                            </a>
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div id="kc-form-buttons" className={kcClsx("kcFormGroupClass")}>
                                <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                                <input
                                    tabIndex={7}
                                    disabled={isLoginButtonDisabled}
                                    className={kcClsx("kcButtonClass", "kcButtonPrimaryClass", "kcButtonBlockClass", "kcButtonLargeClass")}
                                    name="login"
                                    id="kc-login"
                                    type="submit"
                                    value={msgStr("doLogIn")}
                                />
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </Template>
    );
}

function PasswordWrapper(props: { kcClsx: KcClsx; i18n: I18n; passwordInputId: string; children: JSX.Element }) {
    const { kcClsx, i18n, passwordInputId, children } = props;

    const { msgStr } = i18n;

    const [isPasswordRevealed, toggleIsPasswordRevealed] = useReducer((isPasswordRevealed: boolean) => !isPasswordRevealed, false);

    useEffect(() => {
        const passwordInputElement = document.getElementById(passwordInputId);

        assert(passwordInputElement instanceof HTMLInputElement);

        passwordInputElement.type = isPasswordRevealed ? "text" : "password";
    }, [isPasswordRevealed]);

    return (
        <div className={kcClsx("kcInputGroup")}>
            {children}
            <button
                type="button"
                className={kcClsx("kcFormPasswordVisibilityButtonClass")}
                aria-label={msgStr(isPasswordRevealed ? "hidePassword" : "showPassword")}
                aria-controls={passwordInputId}
                onClick={toggleIsPasswordRevealed}
            >
                {isPasswordRevealed ? (
                    <img
                        src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_1358_4612)'%3e%3cpath%20d='M17.94%2017.94C16.2306%2019.243%2014.1491%2019.9649%2012%2020C5%2020%201%2012%201%2012C2.24389%209.68192%203.96914%207.65663%206.06%206.06003M9.9%204.24002C10.5883%204.0789%2011.2931%203.99836%2012%204.00003C19%204.00003%2023%2012%2023%2012C22.393%2013.1356%2021.6691%2014.2048%2020.84%2015.19M14.12%2014.12C13.8454%2014.4148%2013.5141%2014.6512%2013.1462%2014.8151C12.7782%2014.9791%2012.3809%2015.0673%2011.9781%2015.0744C11.5753%2015.0815%2011.1752%2015.0074%2010.8016%2014.8565C10.4281%2014.7056%2010.0887%2014.4811%209.80385%2014.1962C9.51897%2013.9113%209.29439%2013.572%209.14351%2013.1984C8.99262%2012.8249%208.91853%2012.4247%208.92563%2012.0219C8.93274%2011.6191%209.02091%2011.2219%209.18488%2010.8539C9.34884%2010.4859%209.58525%2010.1547%209.88%209.88003'%20stroke='%23667085'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M1%201L23%2023'%20stroke='%23667085'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_1358_4612'%3e%3crect%20width='24'%20height='24'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
                        alt=""
                    />
                ) : (
                    <img
                        src="data:image/svg+xml,%3csvg%20width='24'%20height='24'%20viewBox='0%200%2024%2024'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M1%2012C1%2012%205%204%2012%204C19%204%2023%2012%2023%2012C23%2012%2019%2020%2012%2020C5%2020%201%2012%201%2012Z'%20stroke='%23667085'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3cpath%20d='M12%2015C13.6569%2015%2015%2013.6569%2015%2012C15%2010.3431%2013.6569%209%2012%209C10.3431%209%209%2010.3431%209%2012C9%2013.6569%2010.3431%2015%2012%2015Z'%20stroke='%23667085'%20stroke-width='2'%20stroke-linecap='round'%20stroke-linejoin='round'/%3e%3c/svg%3e"
                        alt=""
                    />
                )}
            </button>
        </div>
    );
}
