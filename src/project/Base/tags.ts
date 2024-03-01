import { BadRequestException } from '@nestjs/common';
import { ValueObject } from 'src/common/database/ValueObject';

export class Tag extends ValueObject {
  private static readonly tagLength = 3;

  private constructor(private readonly tagName: string) {
    super();
  }

  getTagName() {
    return this.tagName;
  }

  static create(tagName: string) {
    if (tagName.length < this.tagLength)
      throw new BadRequestException('Tag length must be at least 3 characters');

    return new Tag(tagName);
  }

  static createTags(tagNames: string[]) {
    if (tagNames.length < 1)
      throw new BadRequestException('At least one tag must be specified');

    const _tags = tagNames.map((tag) => Tag.create(tag));

    return _tags;
  }

  public equals(obj: Tag): boolean {
    return this.tagName.toLowerCase() === obj.tagName.toLowerCase();
  }
}
