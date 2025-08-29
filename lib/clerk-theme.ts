import { dark } from '@clerk/themes';

export const clerkAppearance = {
    baseTheme: dark,
    variables: {
        colorPrimary: 'hsl(var(--primary))',
        colorPrimaryShade: 'hsl(var(--primary))',
        colorBackground: 'hsl(var(--background))',
        colorInputBackground: 'hsl(var(--background))',
        colorInputText: 'hsl(var(--foreground))',
        colorText: 'hsl(var(--foreground))',
        colorTextSecondary: 'hsl(var(--muted-foreground))',
        colorSuccess: 'hsl(142, 76%, 36%)',
        colorDanger: 'hsl(var(--destructive))',
        colorWarning: 'hsl(38, 92%, 50%)',
        borderRadius: '0.5rem',
        fontFamily: 'inherit',
        fontSize: '14px',
        fontWeight: {
            normal: '400',
            medium: '500',
            semibold: '600',
            bold: '700',
        },
    },
    elements: {
        formButtonPrimary: {
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))',
            '&:hover': {
                backgroundColor: 'hsl(var(--primary) / 0.9)',
            },
            '&:focus': {
                boxShadow: '0 0 0 2px hsl(var(--ring))',
            },
        },
        card: {
            backgroundColor: 'hsl(var(--card))',
            borderColor: 'hsl(var(--border))',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        },
        headerTitle: {
            color: 'hsl(var(--foreground))',
        },
        headerSubtitle: {
            color: 'hsl(var(--muted-foreground))',
        },
        socialButtonsBlockButton: {
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--foreground))',
            '&:hover': {
                backgroundColor: 'hsl(var(--muted))',
            },
        },
        formFieldInput: {
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--foreground))',
            '&:focus': {
                borderColor: 'hsl(var(--ring))',
                boxShadow: '0 0 0 2px hsl(var(--ring) / 0.2)',
            },
        },
        formFieldLabel: {
            color: 'hsl(var(--foreground))',
        },
        identityPreviewText: {
            color: 'hsl(var(--foreground))',
        },
        formResendCodeLink: {
            color: 'hsl(var(--primary))',
            '&:hover': {
                color: 'hsl(var(--primary) / 0.8)',
            },
        },
        footerActionLink: {
            color: 'hsl(var(--primary))',
            '&:hover': {
                color: 'hsl(var(--primary) / 0.8)',
            },
        },
        formFieldInputShowPasswordButton: {
            color: 'hsl(var(--muted-foreground))',
            '&:hover': {
                color: 'hsl(var(--foreground))',
            },
        },
        dividerLine: {
            backgroundColor: 'hsl(var(--border))',
        },
        dividerText: {
            color: 'hsl(var(--muted-foreground))',
        },
        formFieldAction: {
            color: 'hsl(var(--primary))',
            '&:hover': {
                color: 'hsl(var(--primary) / 0.8)',
            },
        },
        alertError: {
            backgroundColor: 'hsl(var(--destructive) / 0.1)',
            borderColor: 'hsl(var(--destructive))',
            color: 'hsl(var(--destructive))',
        },
        formFieldSuccessText: {
            color: 'hsl(142, 76%, 36%)',
        },
        formFieldErrorText: {
            color: 'hsl(var(--destructive))',
        },
        otpCodeFieldInput: {
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            color: 'hsl(var(--foreground))',
            '&:focus': {
                borderColor: 'hsl(var(--ring))',
                boxShadow: '0 0 0 2px hsl(var(--ring) / 0.2)',
            },
        },
    },
};