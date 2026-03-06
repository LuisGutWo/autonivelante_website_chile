import Input, { PasswordInput } from "./Input";
import Button from "../Button";

export default {
  title: "Components/Common/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: [
        "text",
        "email",
        "password",
        "number",
        "tel",
        "url",
        "search",
        "date",
        "time",
        "textarea",
      ],
      description: "Tipo de input HTML",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
      description: "Tamaño del input",
    },
    fullWidth: {
      control: "boolean",
      description: "Input ocupa todo el ancho",
    },
    disabled: {
      control: "boolean",
      description: "Input deshabilitado",
    },
    readOnly: {
      control: "boolean",
      description: "Input de solo lectura",
    },
    required: {
      control: "boolean",
      description: "Campo requerido",
    },
    label: {
      control: "text",
      description: "Label del input",
    },
    placeholder: {
      control: "text",
      description: "Texto placeholder",
    },
    helperText: {
      control: "text",
      description: "Texto de ayuda",
    },
    error: {
      control: "text",
      description: "Mensaje de error",
    },
  },
};

// ==========================================
// BASIC INPUTS
// ==========================================

export const Default = {
  args: {
    label: "Full Name",
    placeholder: "Enter your name",
    helperText: "We'll never share your name.",
  },
};

export const WithValue = {
  args: {
    label: "Email Address",
    type: "email",
    defaultValue: "user@example.com",
    helperText: "Your primary email address",
  },
};

export const Required = {
  args: {
    label: "Username",
    placeholder: "Choose a username",
    required: true,
    helperText: "This field is required",
  },
};

export const WithError = {
  args: {
    label: "Email",
    type: "email",
    defaultValue: "invalidemail",
    error: "Please enter a valid email address",
  },
};

// ==========================================
// INPUT TYPES
// ==========================================

export const EmailInput = {
  args: {
    label: "Email Address",
    type: "email",
    placeholder: "you@example.com",
    leftIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
};

export const PasswordInputBasic = {
  render: () => (
    <PasswordInput
      label="Password"
      placeholder="Enter your password"
      helperText="Password must be at least 8 characters"
    />
  ),
};

export const NumberInput = {
  args: {
    label: "Quantity",
    type: "number",
    defaultValue: 1,
    placeholder: "0",
  },
};

export const TelephoneInput = {
  args: {
    label: "Phone Number",
    type: "tel",
    placeholder: "+56 9 1234 5678",
    leftIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  },
};

export const SearchInput = {
  args: {
    label: "Search",
    type: "search",
    placeholder: "Search products...",
    leftIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
  },
};

export const DateInput = {
  args: {
    label: "Birth Date",
    type: "date",
  },
};

export const TextareaInput = {
  args: {
    label: "Message",
    type: "textarea",
    placeholder: "Enter your message here...",
    helperText: "Please be as detailed as possible",
    rows: 5,
  },
};

// ==========================================
// INPUT SIZES
// ==========================================

export const InputSizes = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      <Input size="sm" label="Small Input" placeholder="Size: sm" />
      <Input size="md" label="Medium Input" placeholder="Size: md (default)" />
      <Input size="lg" label="Large Input" placeholder="Size: lg" />
    </div>
  ),
};

// ==========================================
// WITH ICONS
// ==========================================

export const WithLeftIcon = {
  args: {
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    leftIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
        />
      </svg>
    ),
  },
};

export const WithRightIcon = {
  args: {
    label: "URL",
    type: "url",
    placeholder: "https://example.com",
    rightIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    ),
  },
};

export const WithBothIcons = {
  args: {
    label: "Search Location",
    placeholder: "Enter address",
    leftIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    rightIcon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ),
  },
};

// ==========================================
// STATES
// ==========================================

export const Disabled = {
  args: {
    label: "Disabled Input",
    placeholder: "This input is disabled",
    disabled: true,
    helperText: "This field cannot be edited",
  },
};

export const ReadOnly = {
  args: {
    label: "Read Only Input",
    defaultValue: "This value cannot be changed",
    readOnly: true,
    helperText: "This field is read-only",
  },
};

export const FullWidth = {
  args: {
    label: "Full Width Input",
    placeholder: "This input spans the full width",
    fullWidth: true,
  },
};

// ==========================================
// FORM EXAMPLES
// ==========================================

export const LoginForm = {
  render: () => (
    <div style={{ maxWidth: "400px", padding: "2rem" }}>
      <h2 style={{ marginTop: 0 }}>Sign In</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          fullWidth
          leftIcon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          }
        />

        <PasswordInput label="Password" required fullWidth />

        <Button fullWidth variant="primary">
          Sign In
        </Button>
      </div>
    </div>
  ),
};

export const ContactForm = {
  render: () => (
    <div style={{ maxWidth: "600px", padding: "2rem" }}>
      <h2 style={{ marginTop: 0 }}>Contact Us</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <Input label="First Name" placeholder="John" required fullWidth />
          <Input label="Last Name" placeholder="Doe" required fullWidth />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          required
          fullWidth
        />

        <Input
          label="Phone"
          type="tel"
          placeholder="+56 9 1234 5678"
          fullWidth
        />

        <Input
          label="Subject"
          placeholder="How can we help?"
          required
          fullWidth
        />

        <Input
          label="Message"
          type="textarea"
          placeholder="Tell us more about your inquiry..."
          rows={6}
          required
          fullWidth
        />

        <div
          style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
        >
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Send Message</Button>
        </div>
      </div>
    </div>
  ),
};

export const ValidationForm = {
  render: () => (
    <div style={{ maxWidth: "400px", padding: "2rem" }}>
      <h2 style={{ marginTop: 0 }}>Form Validation Example</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        <Input
          label="Valid Email"
          type="email"
          defaultValue="user@example.com"
          helperText="This email is valid"
          fullWidth
        />

        <Input
          label="Invalid Email"
          type="email"
          defaultValue="invalidemail"
          error="Please enter a valid email address"
          fullWidth
        />

        <Input
          label="Required Field"
          required
          error="This field is required"
          fullWidth
        />

        <PasswordInput
          label="Weak Password"
          defaultValue="123"
          error="Password must be at least 8 characters"
          fullWidth
        />
      </div>
    </div>
  ),
};

// ==========================================
// PLAYGROUND
// ==========================================

export const Playground = {
  args: {
    label: "Interactive Input",
    placeholder: "Type something...",
    helperText: "Use the controls below to customize this input",
    type: "text",
    size: "md",
    fullWidth: false,
    disabled: false,
    readOnly: false,
    required: false,
  },
};
