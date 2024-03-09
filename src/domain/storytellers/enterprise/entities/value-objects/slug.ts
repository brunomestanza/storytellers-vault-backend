export class Slug {
  public text: string

  private constructor(text: string) {
    this.text = text
  }

  /**
   * Recieves a string and save it as a slug without normalize it.
   *
   * Example: "an-example-title" => "an-example-title"
   *
   * @param text {string}
   */
  static create(text: string) {
    return new Slug(text)
  }

  /**
   * Recieves a string and normalize it as a slug.
   *
   * Example: "An example title" => "an-example-title"
   *
   * @param text {string}
   */
  static createFromText(text: string) {
    const slugText = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/-$/g, '')

    return new Slug(slugText)
  }
}
