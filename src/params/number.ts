export function match(page: string): page is string {
    return !isNaN(Number(page))
}