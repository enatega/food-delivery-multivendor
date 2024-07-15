export const SPECIAL_ALPHABETS_REGEX = /^[^$&+,:_;=?@#|'<>.^()%!-\s][a-zA-Z\u00C0-\u024F\u1E00-\u1EFF0-9\s-.ēėīįœōūāäëïöüÿÄËÏÖÜŸáćéíńóśÿÄËÏÖÜŚÚÝŹőűŐŰàèìòùÀÈÌÒÙâêîôûÂÊÎÔÛãñõÃÑÕčďěǧňřšťžČĎĚǦŇŘŠŤŽđĐåůÅŮąęĄĘæÆøØçÇłŁßþżŻð]$/i;
export const ATLEAST_ONE_SPECIAL_CHAR_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
export const NO_SPECIAL_CHARACTERS_REGEX = /^[a-zA-Z0-9-]*$/