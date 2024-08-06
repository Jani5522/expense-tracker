import { cn } from "@/lib/utils";
import { Link as ReactLink, useLocation,  } from "react-router-dom";

export default function Link({className, disabled, ...props }) {
    const {pathname} = useLocation()
    return (<>
      <ReactLink
        {...props}
        className={cn(
          'px-3 py-2 text-muted-foreground transition-all hover:text-primary ',
          "md:focus-visible:bg-secondary md:focus-visible:text-secondary-foreground",
          pathname === props.to && "bg-muted text-primary ",
          disabled && 'pointer-events-none',
          className
        )}
        aria-disabled={disabled}
        tabIndex={disabled ? -1 : undefined}
      />
    </>
    )
  }
  