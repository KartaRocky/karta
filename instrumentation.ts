export function register() {
    fetch(`http://localhost:${process.env.PORT ?? '3000'}/api/git`)
  }